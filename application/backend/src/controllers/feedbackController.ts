import { RequestHandler } from "express";
import User from "../models/User";

// Submit Feedback (Requires Logged-in)
export const submitFeedback: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { message, rating } = req.body;
        const user = (req as any).user; // User data attached by the authenticate middleware
        // Find the user in the database
        const dbUser = await User.findOne({ username: user.username });

        if (!dbUser) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (!message || !rating) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // Save feedback
        const feedback = { message, rating, createdAt: new Date() };

        dbUser.feedbacks.push(feedback);
        await dbUser.save();

        res.status(201).json({ message: "Feedback submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit feedback. Please log in to submit feedback!" });
    }
};

// Get All Feedbacks (Only Admin Can Access)
export const getAllFeedback: RequestHandler = async (req, res) => {
    try {
        const { id } = (req as any).user;
        // Find the user in the database
        const user = await User.findOne({ _id: id, isVerified: true });

        if (!user) {
            res.status(404).json({ error: "User not found or not verified." });
            return;
        }

        // Restrict to admins only
        if (!user.isAdmin) {
            res.status(405).json({ error: "Access denied. Only admins can retrieve feedbacks." });
            return;
        }

        // Retrieve all users who have feedback
        const usersWithFeedback = await User.find({ feedbacks: { $exists: true, $not: { $size: 0 } }}).select("username feedbacks");

        if (!usersWithFeedback.length) {
            res.status(406).json({ error: "No feedbacks found." });
            return;
        }

        // Format response with username and feedbacks
        const feedbackData = usersWithFeedback.map(u => ({
        username: u.username,
        feedbacks: u.feedbacks,
        }));

        res.status(200).json({ message: "All feedbacks retrieved successfully", feedbackData, });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve all feedbacks", details: (error as Error).message, });
        return;
    }
};