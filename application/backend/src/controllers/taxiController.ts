import { Request, Response } from 'express';
import { fetchAvailableTaxis } from '../services/taxiService';

export const getAvailableTaxisHandler = async (req: Request, res: Response) => {
  try {
    const liveLatitude = Number(req.query.lat) || 1.34;
    const liveLongitude = Number(req.query.lon) || 103.68;
    const radius = 3000; // Default radius in meters
    const taxis = await fetchAvailableTaxis(liveLatitude, liveLongitude, radius);
    res.json(taxis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch taxi data' });
  }
};