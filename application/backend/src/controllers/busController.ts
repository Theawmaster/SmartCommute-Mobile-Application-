import { Request, Response } from 'express';
import { getBusArrival } from '../utils/busUtils';
import { getNearbyBusStops } from './busStopController';
import { getBusStopDetails } from './busStopNameController';

/**
 * @swagger
 * /api/bus/bus-arrival:
 *   get:
 *     summary: Get bus arrival information
 *     parameters:
 *       - name: busStopCode
 *         in: query
 *         description: The bus stop code to fetch arrival information for.
 *         required: false
 *         schema:
 *           type: string
 *           default: '27069'
 *     responses:
 *       200:
 *         description: Successful response with bus arrival data.
 *       500:
 *         description: Failed to fetch bus arrival data.
 */
export const getBusArrivalHandler = async (req: Request, res: Response) => {
  try {
    const busStopCode = req.query.busStopCode?.toString() || '27069';
    const result = await getBusArrival(busStopCode, 1.2538, 103.4738);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus arrival data' });
  }
};

/**
 * @swagger
 * /api/bus/nearby-bus-stops:
 *   get:
 *     summary: Get nearby bus stops based on live location
 *     parameters:
 *       - name: lat
 *         in: query
 *         description: Latitude of the user's location.
 *         required: false
 *         schema:
 *           type: number
 *           default: 1.344104
 *       - name: lon
 *         in: query
 *         description: Longitude of the user's location.
 *         required: false
 *         schema:
 *           type: number
 *           default: 103.687252
 *     responses:
 *       200:
 *         description: Successful response with nearby bus stops data.
 *       500:
 *         description: Failed to fetch nearby bus stops data.
 */
export const getNearbyBusStopsHandler = async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 1.344104;
    const lon = parseFloat(req.query.lon as string) || 103.687252;
    const stops = await getNearbyBusStops(lat, lon, 1000);
    res.json(stops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby bus stops' });
  }
};

/**
 * @swagger
 * /api/busstop/{busStopCode}:
 *   get:
 *     summary: Get detailed information about a specific bus stop
 *     parameters:
 *       - name: busStopCode
 *         in: path
 *         description: The bus stop code to fetch details for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with bus stop details.
 *       400:
 *         description: Bad request if bus stop code is missing.
 *       500:
 *         description: Failed to fetch bus stop details.
 */
export const getBusStopDetailsHandler = async (req: Request, res: Response) => {
  const { busStopCode } = req.params;
  if (!busStopCode) {
    res.status(400).json({ error: 'BusStopCode is required' });
    return;
  }

  try {
    const details = await getBusStopDetails(busStopCode);
    res.json(details);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
