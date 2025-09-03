import axios from 'axios';
import { calculateDistance } from '../utils/geoUtils';

export interface TaxiData {
  latitude: number;
  longitude: number;
  etaMinutes: number;
}

/*
    * Fetches available taxis within a specified radius from the given coordinates.
    * @param liveLatitude - Latitude of the user's location.
    * @param liveLongitude - Longitude of the user's location.
    * @param radius - Radius in meters to search for taxis.
    * @returns A promise that resolves to an array of TaxiData objects.
*/
export async function fetchAvailableTaxis(
  liveLatitude: number,
  liveLongitude: number,
  radius: number // radius in meters
): Promise<TaxiData[]> {
  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/Taxi-Availability';
    const headers = {
      'AccountKey': process.env.LTA_API_KEY,
      'accept': 'application/json'
    };

    const response = await axios.get(url, { headers });
    const allTaxis: any[] = (response.data.value || response.data) || [];

    const averageSpeedKmph = 30; // realistic average SG speed
    const nearbyTaxis: TaxiData[] = [];

    for (const taxi of allTaxis) {
      const lat = Number(taxi.Latitude || taxi.latitude || taxi.lat);
      const lon = Number(taxi.Longitude || taxi.longitude || taxi.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.warn('Invalid coordinates:', taxi);
        continue;
      }

      const distanceMeters = calculateDistance(liveLatitude, liveLongitude, lat, lon);

      if (distanceMeters > radius) continue;

      const eta = Math.ceil((distanceMeters / 1000 / averageSpeedKmph) * 60); // minutes

      if (isNaN(eta)) {
        console.warn(`Invalid ETA for taxi at (${lat}, ${lon}), distance: ${distanceMeters}`);
        continue;
      }

      nearbyTaxis.push({
        latitude: lat,
        longitude: lon,
        etaMinutes: eta
      });
    }

    return nearbyTaxis;
  } catch (error) {
    console.error('Error fetching taxi availability:', error);
    throw error;
  }
}
