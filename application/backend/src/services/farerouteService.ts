import axios from 'axios';
import polyline from '@mapbox/polyline';
import fs from 'fs';
import path from 'path';
const fareDataPath = path.join(__dirname, '../data/transportFare.json');
const fareData = JSON.parse(fs.readFileSync(fareDataPath, 'utf-8'));

/**
 * Fetches fare route data from OneMap API.
 */
export async function fetchFareRouteFromOneMap(
  start: string,
  end: string,
  routeType: string = 'pt',
  date: string = '08-13-2023',
  time: string = '07:35:00',
  mode: string = 'TRANSIT',
  maxWalkDistance: string = '50',
  numItineraries: string = '5'
): Promise<any> {
  const ONE_MAP_URL = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${start}&end=${end}&routeType=${routeType}&date=${date}&time=${encodeURIComponent(time)}&mode=${mode}&maxWalkDistance=${maxWalkDistance}&numItineraries=${numItineraries}`;

  const token = process.env.ONE_MAP_TOKEN?.trim();
  if (!token) throw new Error('ONE_MAP_TOKEN is not defined');
  const authHeader = token.startsWith('Bearer') ? token : `Bearer ${token}`;

  const response = await axios.get(ONE_MAP_URL, {
    headers: { Authorization: authHeader },
  });

  const data = response.data;

  // 🚕 Cab Mode
  if (routeType === 'drive' && data.route_geometry && data.route_summary) {
    const coords = decodePolylineToCoords(data.route_geometry);

    const itinerary = {
      durationInMinutes: Math.round(data.route_summary.total_time / 60),
      distance: data.route_summary.total_distance,
      fare: estimateCabFare(data.route_summary.total_distance / 1000, data.route_summary.total_time / 60),
      legs: [
        {
          mode: 'CAR',
          from: {
            name: 'Origin',
            lat: coords[0].latitude,
            lon: coords[0].longitude,
          },
          to: {
            name: 'Destination',
            lat: coords[coords.length - 1].latitude,
            lon: coords[coords.length - 1].longitude,
          },
          legGeometry: {
            points: data.route_geometry,
          },
          intermediateStops: [],
          instructions: data.route_instructions?.map((step: any) => step[9]) || [],
        },
      ],
    };

    return {
      plan: { itineraries: [itinerary] },
      cheapestIndex: 0,
      fastestIndex: 0,
    };
  }

  // 🚉 Public Transport Mode
  if (data.plan && data.plan.itineraries) {
    data.plan.itineraries.forEach((itinerary: any) => {
      itinerary.durationInMinutes = Math.round(itinerary.duration / 60);
    });

    let cheapestIndex = 0;
    let fastestIndex = 0;
    let minFare = parseFloat(data.plan.itineraries[0].fare);
    let minDuration = data.plan.itineraries[0].durationInMinutes;

    data.plan.itineraries.forEach((itinerary: any, idx: number) => {
      const fare = parseFloat(itinerary.fare);
      const duration = itinerary.durationInMinutes;
      if (fare < minFare) {
        minFare = fare;
        cheapestIndex = idx;
      }
      if (duration < minDuration) {
        minDuration = duration;
        fastestIndex = idx;
      }
    });

    return {
      plan: data.plan,
      cheapestIndex,
      fastestIndex,
    };
  }

  throw new Error('Invalid route data returned from OneMap');
}

/**
 * Estimate cab fare based on distance and time.
 */
function estimateCabFare(distanceKm: number, durationMin: number): string {
    const flagDownFareRange = fareData.taxiFareTable.find((f: any) => f.taxiFareType === 'Flag-Down Fare' && f.taxiType === 'Standard')?.fare;
    const flagDownFare = flagDownFareRange ? parseFloat(flagDownFareRange.replace(/\$| .*/g, '')) : 4.40;
  
    const per400mFare = 0.26;
    const per45secWaitFare = 0.26;
  
    let totalFare = flagDownFare;
    const additionalMeters = Math.max(0, distanceKm * 1000 - 1000);
  
    if (distanceKm <= 10) {
      const distanceUnits = Math.floor(additionalMeters / 400);
      totalFare += distanceUnits * per400mFare;
    } else {
      const first10km = 9000;
      const beyond10km = additionalMeters - first10km;
      const firstUnits = Math.floor(first10km / 400);
      const beyondUnits = Math.floor(beyond10km / 350);
      totalFare += firstUnits * per400mFare + beyondUnits * per400mFare;
    }
  
    const waitUnits = Math.floor((durationMin * 60) / 45);
    totalFare += waitUnits * per45secWaitFare;
  
    return totalFare.toFixed(2);
  return totalFare.toFixed(2);
}

/**
 * Decode encoded polyline into coordinate objects.
 */
function decodePolylineToCoords(encoded: string): { latitude: number; longitude: number }[] {
  return polyline.decode(encoded).map(([lat, lng]: number[]) => ({
    latitude: lat,
    longitude: lng,
  }));
}
