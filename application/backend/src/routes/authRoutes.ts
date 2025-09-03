import express from "express";
import { registerUser, loginUser, logoutUser, verifyLoginOTP, verifyEmail, resendOTP } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verifyLoginOTP", verifyLoginOTP);
router.post("/verify", verifyEmail);
router.post("/resendOTP", resendOTP);

export default router; 