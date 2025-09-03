// trainRoutes.ts
import { Router } from 'express';
import { getNearbyTrainCrowdHandler } from '../controllers/trainController';

const router = Router();

router.get('/nearby-train-crowd', getNearbyTrainCrowdHandler);

export default router;
