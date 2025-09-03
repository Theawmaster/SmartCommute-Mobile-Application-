import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

/*
    * Define a type for an individual bus arrival
    * @typedef {Object} BusArrival
    * @property {string} estimatedArrival - Estimated arrival time in ISO format.
    * @property {string} load - Load information (e.g., "SEA", "LSD").
    * @property {string} type - Type of bus (e.g., "SD", "DD").
*/
export interface BusArrival {
  estimatedArrival: string;
  load: string;
  type: string;
  latitude: number;
  longitude: number;
}

/*
    * Define a type for the bus service data, including multiple next bus arrivals
    * @typedef {Object} BusServiceData
    * @property {string} serviceNumber - The bus service number.
    * @property {string} operator - The operator of the bus service.
    * @property {BusArrival[]} nextBuses - Array of next bus arrivals.
*/
export interface BusServiceData {
  serviceNumber: string;
  operator: string;
  nextBuses: BusArrival[];
}

/*
    * Helper function to calculate minutes from the current time to the given ISO date string.
    * Returns a formatted string:
    *  - "here" if the calculated minutes is negative,
    *  - "arr" if the calculated minutes is 0,
    *  - Otherwise, "<minutes> mins".
    * @param {string} isoDate - The ISO date string representing the estimated arrival time.
    * @returns {string} Formatted arrival string.
*/
function getFormattedArrival(isoDate: string): string {
  const arrivalDate = new Date(isoDate);
  const now = new Date();
  const diffInMs = arrivalDate.getTime() - now.getTime();
  const minutes = Math.round(diffInMs / 60000);

  if (minutes < 0) return 'here';
  if (minutes === 0) return 'arr';
  return `${minutes} mins`;
}

/*
    * Fetches bus arrival data for a given bus stop code.
    * @param {string} busStopCode - Bus stop reference code.
    * @param {number} latitude - Provided latitude (for potential future use).
    * @param {number} longitude - Provided longitude (for potential future use).
    * @returns {Promise<BusServiceData[]>} Promise that resolves to an array of cleaned bus service data.
*/
export async function getBusArrival(
  busStopCode: string,
  latitude: number,
  longitude: number
): Promise<BusServiceData[]> {
  try {
    const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`;
    const headers = {
      AccountKey: process.env.LTA_API_KEY || '',
      accept: 'application/json',
    };

    const response = await axios.get(url, { headers });
    const services = response.data.Services;

    const cleanedData: BusServiceData[] = services.map((service: any) => {
      const nextBuses: BusArrival[] = [];

      [service.NextBus, service.NextBus2, service.NextBus3].forEach((bus: any) => {
        if (bus?.EstimatedArrival) {
          nextBuses.push({
            estimatedArrival: getFormattedArrival(bus.EstimatedArrival),
            load: bus.Load,
            type: bus.Type,
            latitude: bus.Latitude,
            longitude: bus.Longitude,
          });
        }
      });

      return {
        serviceNumber: service.ServiceNo,
        operator: service.Operator,
        nextBuses,
      };
    });

    return cleanedData;
  } catch (error) {
    console.error('Error fetching bus arrival data:', error);
    throw error;
  }
}
