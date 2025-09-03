import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { calculateDistance } from '../utils/geoUtils';
import { getBusStopDetails } from './busStopNameController';



/** Define an interface for a bus stop */
export interface EnrichedBusStop {
  busStopCode: string;
  latitude: number;
  longitude: number;
  distance: number;      // in meters
  description: string;
}


/*
  * Fetches bus stop data from LTA and enriches it with additional information.
  * @param {number} liveLatitude - Latitude of the user's location.
  * @param {number} liveLongitude - Longitude of the user's location.
  * @param {number} radius - Radius in meters to filter bus stops.
  * @returns {Promise<EnrichedBusStop[]>} - A promise that resolves to an array of enriched bus stops.
  * @throws {Error} - Throws an error if the XML data cannot be fetched or parsed.
 */
export async function getNearbyBusStops(
  liveLatitude: number,
  liveLongitude: number,
  radius: number
): Promise<EnrichedBusStop[]> {
  try {
    const url = 'https://www.lta.gov.sg/map/busService/bus_stops.xml';
    const response = await axios.get(url, { headers: { 'Accept': 'application/xml' }, timeout: 10000 });

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const jsonObj = parser.parse(response.data);

    if (!jsonObj.busstops || !jsonObj.busstops.busstop) {
      throw new Error("Unexpected XML structure");
    }

    const allBusStops: any[] = jsonObj.busstops.busstop;

    const enrichedStops: EnrichedBusStop[] = [];

    for (const stop of allBusStops) {
      let stopLat = Number(stop.coordinates?.lat ?? stop.latitude);
      let stopLon = Number(stop.coordinates?.long ?? stop.longitude);

      if (isNaN(stopLat) || isNaN(stopLon)) continue;

      const distance = calculateDistance(liveLatitude, liveLongitude, stopLat, stopLon);
      if (distance > radius) continue;

      let description = 'Unknown';
      try {
        const result = await getBusStopDetails(stop.name);
        description = result.description ?? 'Unknown';
      } catch {
        console.warn(`No description found for ${stop.name}`);
      }

      enrichedStops.push({
        busStopCode: stop.name,
        latitude: stopLat,
        longitude: stopLon,
        distance,
        description,
      });
    }

    return enrichedStops;
  } catch (error) {
    console.error("Error fetching/parsing bus stop XML data:", error);
    throw error;
  }
}
