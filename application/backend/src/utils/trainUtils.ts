import fs from 'fs';
import csvParser from 'csv-parser';
import axios from 'axios';
import path from 'path';
import { TrainCrowdData } from '../controllers/trainController';

/** Haversine formula to compute the distance (in kilometers) between two coordinates */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Reads the MRT stations CSV file and returns an array of station objects.
 * Assumes CSV columns include: OBJECTID, STN_NAME, STN_NO, Latitude, Longitude, etc.
 */
export function readMRTStationsCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

/**
 * Extracts the train line from the station number.
 * For example, if station number is "EW7", we map "EW" to "EWL".
 */
export function getTrainLine(stnNo: string): string | undefined {
    if (!stnNo) return undefined;
    const match = stnNo.match(/^[A-Za-z]+/);
    if (!match) return undefined;
    const prefix = match[0];
    const mapping: { [key: string]: string } = {
      EW: 'EWL',
      NS: 'NSL',
      NE: 'NEL',
      CC: 'CCL',
      TE: 'TEL',
      DT: 'DTL',
    };
    return mapping[prefix] || undefined;
  }

  /**
 * Fetches nearby MRT stations within the specified radius and returns their crowd density data.
 * - Reads the MRT station CSV file from the docs directory.
 * - Filters stations based on the provided live location and radius.
 * - For each unique train line among the nearby stations, calls the crowd API.
 * - Matches the API results with the nearby stations by comparing the station code (STN_NO).
 *
 * @param liveLatitude - Your current latitude.
 * @param liveLongitude - Your current longitude.
 * @param radius - Maximum distance (in km) to search for nearby stations.
 * @returns Promise that resolves to an array of TrainCrowdData objects.
 */
export async function getNearbyTrainCrowd(
    liveLatitude: number,
    liveLongitude: number,
    radius: number
  ): Promise<TrainCrowdData[]> {
    try {
      // Construct the absolute path to the CSV file.
      const csvPath = path.join(__dirname, '../docs/mrtStations.csv');
      const stations = await readMRTStationsCSV(csvPath);
      
      // Filter stations that are within the specified radius.
      const nearbyStations = stations.filter(station => {
        const lat = parseFloat(station.Latitude);
        const lon = parseFloat(station.Longitude);
        if (isNaN(lat) || isNaN(lon)) return false;
        const distance = calculateDistance(liveLatitude, liveLongitude, lat, lon);
        return distance <= radius;
      });
      
      if (nearbyStations.length === 0) {
        return [];
      }
      
      // Group the nearby stations by their train line (derived from STN_NO).
      const stationsByLine: { [line: string]: any[] } = {};
      for (const station of nearbyStations) {
        const trainLine = getTrainLine(station.STN_NO);
        if (!trainLine) continue;
        if (!stationsByLine[trainLine]) {
          stationsByLine[trainLine] = [];
        }
        stationsByLine[trainLine].push(station);
      }
      
      const results: TrainCrowdData[] = [];
      
      // For each train line, call the crowd API and match the results.
      const lineKeys = Object.keys(stationsByLine);
      for (const line of lineKeys) {
        const url = `https://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainLine=${line}`;
        const headers = {
          'AccountKey': process.env.LTA_API_KEY,
          'accept': 'application/json'
        };
        const response = await axios.get(url, { headers });
        
        // Assume the API returns an object with a "value" property that is an array.
        const crowdDataArr = response.data.value || [];
        
        // For each nearby station in this train line, match using STN_NO.
        const nearbyForLine = stationsByLine[line];
        for (const station of nearbyForLine) {
          // Use STN_NO for matching with the API response.
          const stationNo = station.STN_NO;
          const crowdData = crowdDataArr.find((d: any) => d.Station === stationNo);
          if (crowdData) {
            results.push({
              station: station.STN_NAME, // Return the full station name for clarity
              crowdLevel: crowdData.CrowdLevel,
              latitude: parseFloat(station.Latitude),
              longitude: parseFloat(station.Longitude),
            });
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error fetching nearby train crowd data:', error);
      throw error;
    }
  }