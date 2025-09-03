// routes/chatbotRoutes.ts
import { Router } from 'express';
import { getChatbotResponseHandler } from '../controllers/chatbotController';

const router = Router();

router.post('/chat', getChatbotResponseHandler);
router.get('/chat', getChatbotResponseHandler); // Reuse same handler for GET

export default router;
