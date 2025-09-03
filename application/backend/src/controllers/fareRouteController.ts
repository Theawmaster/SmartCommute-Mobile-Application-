import { Request, Response, NextFunction } from 'express';
import { geocodeOneMap } from '../utils/geoUtils';
import { fetchFareRouteFromOneMap } from '../services/farerouteService';

export const getFareRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { start, end, routeType, date, time, mode, maxWalkDistance, numItineraries } = req.query;

    if (!start || !end) {
      res.status(400).json({ error: 'Origin and destination are required.' });
      return;
    }

    start = (start as string).trim();
    end = (end as string).trim();

    const coordinateRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

    if (!coordinateRegex.test(start)) {
      const geo = await geocodeOneMap(start);
      if (!geo) {
        res.status(400).json({ error: 'Origin location not valid.' });
        return;
      }
      start = `${geo.lat},${geo.lng}`;
    }

    if (!coordinateRegex.test(end)) {
      const geo = await geocodeOneMap(end);
      if (!geo) {
        res.status(400).json({ error: 'Destination location not valid.' });
        return;
      }
      end = `${geo.lat},${geo.lng}`;
    }

    const routingData = await fetchFareRouteFromOneMap(
      start,
      end,
      routeType as string,
      date as string,
      time as string,
      mode as string,
      maxWalkDistance as string,
      numItineraries as string
    );

    res.json(routingData);
  } catch (error: any) {
    console.error('Error in getFareRoute:', error.message);
    next(error);
  }
};
