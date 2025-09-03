// Example: geocodeOneMap.ts
export async function geocodeOneMap(placeName: string): Promise<{ lat: number, lng: number } | null> {
    const url = `https://developers.onemap.sg/commonapi/search?searchVal=${encodeURIComponent(placeName)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocode request failed. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: parseFloat(result.LATITUDE),
          lng: parseFloat(result.LONGITUDE),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in geocoding:', error);
      return null;
    }
  }
  