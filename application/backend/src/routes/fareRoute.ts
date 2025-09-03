// backend/routes/fareRoute.ts
import { Router } from 'express';
import { getFareRoute } from '../controllers/fareRouteController';

const router = Router();

// When a GET request is made to /api/fare-route, the getFareRoute controller is invoked.
router.get('/', getFareRoute);

export default router;
