import express from "express";
import { submitFeedbackCookie, getAllFeedbackCookie } from "../controllers/feedbackControllerTest";

const router = express.Router();

router.post("/submitfeedbackCookie", submitFeedbackCookie);
router.get("/retrievefeedbacksCookie", getAllFeedbackCookie);

export default router;