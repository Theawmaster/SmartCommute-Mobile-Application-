import { RequestHandler } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter, sendLoginOTPEmail } from "../services/mailer";
import { generateOTP } from "../utils/otp"; 

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register a new user
export const registerUser: RequestHandler = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // Check if email exists
      const existingUserEmail = await User.findOne({ email });

      if (existingUserEmail) {
        res.status(400).json({ message: "Email already in use" });
        return; 
      }

      // Check if username exists
      const existingUsername  = await User.findOne({ username });
      if (existingUsername) {
        res.status(401).json({ message: "Username already in use" });
        return; 
      }
    
      // Generate a 6-digit OTP
      const verificationOTP = generateOTP();

      // Create user
      const newUser = new User({ 
        username, 
        email, 
        password, 
        verificationToken: verificationOTP, 
        isVerified: false 
      });
      await newUser.save();

      req.session.userId = newUser._id.toString();

      // Setup email options
      const mailOptions = {
        from: process.env.FROM_EMAIL, 
        to: email,
        subject: "Verify Your Email",
        text: `Hello ${username},\n\nBelow is your OTP verification token:\n\n${verificationOTP}\n\nThank you!`,
      };

      // Send the verification email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending verification email:", error);
        } else {
          console.log("Verification email sent:", info.response);
        }
      });

      res.status(201).json({ message: "User registered. Please verify your email." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

// Login User
export const loginUser: RequestHandler = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      if (!user.isVerified) {
        res.status(401).json({ message: "Email not verified" });
        return;
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        res.status(402).json({ message: "Invalid credentials" });
        return;
      }

      req.session.userId = user._id.toString();

      // Generate OTP after successful login
      const loginOTP = generateOTP();

      user.verificationToken = loginOTP;
      await user.save();

      // Send OTP email
      await sendLoginOTPEmail(user, loginOTP);

      res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

// Logout User
export const logoutUser: RequestHandler = async (req, res) => {
    try {
      const token = req.cookies.authToken; // Get token from cookie
      if (!token) {
        res.status(400).json({ message: "Not logged in" });
        return; 
      }

      // Clear the auth cookie
      res.clearCookie("authToken");

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
}; 

// Verify Login OTP
export const verifyLoginOTP: RequestHandler = async (req, res) => {
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
      const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin, isPremium: user.isPremium }, JWT_SECRET, { expiresIn: "1d" });
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: "strict",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

// Verify Email
export const verifyEmail: RequestHandler = async (req, res) => {
    try {
      const { otp } = req.body;

      // Find user with the provided OTP
      const user = await User.findOne({ verificationToken: otp });

      if (!user || !otp) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }

      // Verify user
      user.isVerified = true;
      user.verificationToken = ""; // Clear OTP after verification
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

// Resend OTP
export const resendOTP: RequestHandler = async (req, res) => {
    try {
      // Use session data to identify the user
      const userId = req.session.userId;

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Generate a new OTP for the user
      let newOTP = generateOTP();
      // Ensure the new OTP is different from the current one
      while(newOTP === user.verificationToken) {
        newOTP = generateOTP();
      }
      
      // Update the user's OTP in the DB
      user.verificationToken = newOTP;
      await user.save();

      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "Your New OTP",
        text: `Hello ${user.username},\n\nYour new OTP is: ${newOTP}\n\nThank you!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP email:", error);
        } else {
          console.log("OTP email sent:", info.response);
        }
      });
      
      res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};