import { RequestHandler } from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Submit Feedback 
export const submitFeedbackCookie: RequestHandler = async (req, res): Promise<void> => {
    try {
        // Get token from request cookies 
        const token = req.cookies?.authToken;

        if (!token) {
          res.status(401).json({ error: "Access denied. No token provided." });
          return;
        }

        // Verify JWT token
        let decoded: any;

        try {
          decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
          res.status(401).json({ error: "Invalid or expired token." });
          return;
        }

        const user = await User.findOne({ isVerified: true, _id: decoded.id });

        if (!user) {
          res.status(404).json({ error: "User not found or not logged in." });
          return;
        }

        // Get feedback message and rating from request body
        const { message, rating } = req.body;

        if (!message || !rating) {
          res.status(400).json({ error: "Missing required fields" });
          return;
        }

        // Save feedback inside the user document
        const feedback = { message, rating, createdAt: new Date() };

        user.feedbacks.push(feedback);
        await user.save();

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit feedback", details: (error as Error).message });
    }
};
  
// Fetch All Feedbacks (Only Admin Can Access)
export const getAllFeedbackCookie: RequestHandler = async (req, res): Promise<void> => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies?.authToken;

        if (!token) {
          res.status(401).json({ error: "Unauthorized: Please log in to view feedback." });
          return;
        }

        // Verify JWT token
        let decoded: any;
        try {
          decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
          res.status(401).json({ error: "Invalid or expired token." });
          return;
        }

        // Find the user using the decoded token
        const user = await User.findOne({ isVerified: true, _id: decoded.id });

        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }

        // Restrict to Admins only
        if (!user.isAdmin) {
          res.status(403).json({ error: "Access denied. Only admins can retrieve feedbacks." });
          return;
        }

        // Retrieve all users who have feedback
        const usersWithFeedback = await User.find({ feedbacks: { $exists: true, $not: { $size: 0 } } }).select( "username feedbacks" );

        if (!usersWithFeedback.length) {
          res.status(404).json({ error: "No feedbacks found." });
          return;
        }

        // Format response with username and feedbacks
        const feedbackData = usersWithFeedback.map((user) => ({
        username: user.username,
        feedbacks: user.feedbacks,
        }));

        res.status(200).json({ message: "All feedbacks retrieved successfully", feedbackData });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve all feedbacks", details: (error as Error).message });
    }
};