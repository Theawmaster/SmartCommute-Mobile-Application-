import axios from 'axios';

/**
 * Calculates the Haversine distance between two GPS coordinates in kilometers.
 * @param lat1 Latitude of point A
 * @param lon1 Longitude of point A
 * @param lat2 Latitude of point B
 * @param lon2 Longitude of point B
 * @returns Distance in kilometers
 */
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
    return R * c * 1000; // Convert to meters
  }

/**
 * Geocodes a place name using OneMap API.
 * @param placeName - The place name to geocode.
 * @returns The latitude and longitude of the place, or null if not found.
 */
export async function geocodeOneMap(placeName: string): Promise<{ lat: number; lng: number } | null> {
  const searchURL = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(placeName)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  try {
    const response = await axios.get(searchURL);
    const results = response.data.results;
    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].LATITUDE),
        lng: parseFloat(results[0].LONGITUDE)
      };
    }
    return null;
  } catch (error: any) {
    console.error("Geocoding error:", error.message);
    return null;
  }
}
  
  