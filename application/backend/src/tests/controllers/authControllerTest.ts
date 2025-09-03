import { RequestHandler } from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Verify Login OTP
export const verifyLoginOTPCookie: RequestHandler = async (req, res) => {
    try {
      const { otp } = req.body;
      const user = await User.findOne({ verificationToken: otp });

      if (!user || !otp) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }

      // Clear OTP after successful verification
      user.verificationToken = "";
      await user.save();

      // Generate JWT token and send it to the user
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: "strict",
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};