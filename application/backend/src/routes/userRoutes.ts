import express from 'express';
import { authenticate } from '../middleware/auth';
import { getUserById } from '../controllers/userController';

const router = express.Router();

router.get("/userid", authenticate, getUserById);

export default router;