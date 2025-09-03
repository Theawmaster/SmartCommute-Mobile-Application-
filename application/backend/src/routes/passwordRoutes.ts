import express from 'express';
import { authenticate } from '../middleware/auth';
import { changePassword, forgotPassword, changeForgotPassword, verifyForgetPassword } from '../controllers/passwordController';

const router = express.Router();

router.post("/changepassword", authenticate, changePassword);
router.post("/forgotPassword", forgotPassword);
router.post("/changeForgotPassword", changeForgotPassword);
router.post("/verifyForgotPassword", verifyForgetPassword);

export default router;