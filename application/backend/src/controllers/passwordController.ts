import { RequestHandler } from "express";
import User from "../models/User";
import dotenv from "dotenv";
import { transporter } from "../services/mailer";
import { generateOTP } from "../utils/otp";

dotenv.config();

// Change Password
export const changePassword: RequestHandler = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
    
        // Validate request body
        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Please provide both Old and New Password." });
            return;
        }
    
        // Extract user info from the request (authenticate middleware)
        const userFromToken = (req as any).user; // { id: string, username: string }
    
        if (!userFromToken) {
            res.status(401).json({ message: "Invalid or missing token. Please log in first." });
            return;
        }
    
        // Find the user in the database
        const user = await User.findById(userFromToken.id);
        if (!user) {
            res.status(402).json({ message: "User not found." });
            return;
        }
    
        // Compare the old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(403).json({ message: "Old password is incorrect." });
            return;
        }
    
        // Update the user's password
        user.password = newPassword; 
        await user.save();
    
        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
};

// Forgot Password
export const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }
        
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        
        // Generate a new OTP for password reset
        const otp = generateOTP();

        user.verificationToken = otp;
        await user.save();
    
        // Set up email options for sending the OTP
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: "Your OTP for Password Reset",
            text: `Hello ${user.username},\n\nYour OTP for password reset is: ${otp}\n\nPlease use this OTP to proceed with changing your password.\n\nThank you!`,
        };
    
        // Send the OTP email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error("Error sending OTP email:", error);
            } else {
            console.log("Forgot password OTP email sent:", info.response);
            }
        });
    
        res.status(200).json({ message: "OTP sent to your email for password reset." });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Change Forgot Password
export const changeForgotPassword: RequestHandler = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            res.status(404).json({ message: "Email and new password are required." });
            return;
        }
        
        const user = await User.findOne({ email });

        if (!user) {
            res.status(402).json({ message: "User not found." });
            return;
        }
        
        // Update password (assumes your pre-save hook handles password hashing)
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ message: "Password changed successfully." });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
};

  // Verify Forget Password OTP
export const verifyForgetPassword: RequestHandler = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(401).json({ message: "Email and OTP is required." });
            return;
        }

        // Look up the user by email and OTP
        const user = await User.findOne({ email, verificationToken: otp });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired OTP." });
            return;
        }

        user.verificationToken = "";
        await user.save();

        res.status(200).json({ message: "OTP verified successfully for password reset." });
        } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
}; 