// backend/src/routes/busRoutes.ts
import express from 'express';
import {
  getBusArrivalHandler,
  getNearbyBusStopsHandler,
  getBusStopDetailsHandler,
} from '../controllers/busController';

const router = express.Router();

router.get('/bus-arrival', getBusArrivalHandler);
router.get('/nearby-bus-stops', getNearbyBusStopsHandler);
router.get('/:busStopCode', getBusStopDetailsHandler);

export default router;
