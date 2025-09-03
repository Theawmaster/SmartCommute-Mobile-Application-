import { RequestHandler } from "express";
import User from "../models/User";

// Get user details by ID 
export const getUserById: RequestHandler = async (req, res) => {
    try {
      // User data attached by the authenticate middleware
      const user = (req as any).user; 
      const dbUser = await User.findOne({ username: user.username });

      if (!dbUser) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json({ message: "User details fetched successfully.", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
      return;
    }
};