import { Router } from 'express';
import { getAvailableTaxisHandler } from '../controllers/taxiController';

const router = Router();
router.get('/taxi-availability', getAvailableTaxisHandler);
export default router;