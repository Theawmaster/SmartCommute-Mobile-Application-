import express from 'express';
import { authenticate } from '../middleware/auth';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController';

const router = express.Router();

router.post("/submitfeedback", authenticate, submitFeedback);
router.get("/retrievefeedbacks", authenticate, getAllFeedback);

export default router;