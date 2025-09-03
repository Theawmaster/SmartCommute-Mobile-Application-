import express from "express";
import { verifyLoginOTPCookie } from "../controllers/authControllerTest";

const router = express.Router();

router.post("/verifyLoginOTPCookie", verifyLoginOTPCookie);

export default router;