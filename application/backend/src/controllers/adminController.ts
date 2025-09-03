import { RequestHandler } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Promote a User to Admin 
export const makeUserAdmin: RequestHandler = async (req, res): Promise<void> => {
    try {
      // Retrieve the admin token from cookies or headers
      const token = req.cookies?.authToken || req.header("Authorization")?.split(" ")[1];
  
      if (!token) {
        res.status(401).json({ error: "Unauthorized: Please log in as an admin." });
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
  
      // Get the username or email of the user to be promoted
      const { username } = req.body;
  
      if (!username) {
        res.status(400).json({ error: "Username is required to promote a user to admin." });
        return;
      }
  
      // Find the user to be promoted
      const userToPromote = await User.findOne({ username });
  
      if (!userToPromote) {
        res.status(404).json({ error: "User not found." });
        return;
      }
  
      // Check if the user is already an admin
      if (userToPromote.isAdmin) {
        res.status(400).json({ error: "User is already an admin." });
        return;
      }
  
      // Promote the user to admin
      userToPromote.isAdmin = true;
      await userToPromote.save();
  
      res.status(200).json({ message: `User ${username} is now an admin.` });
    } catch (error) {
      res.status(500).json({ error: "Failed to promote user to admin", details: (error as Error).message });
    }
};
  
// Promote a User to Premium
export const makeUserPremium: RequestHandler = async (req, res): Promise<void> => {
    try {
      // Get the token from cookies or Authorization header
      const token = req.cookies?.authToken || req.header("Authorization")?.split(" ")[1];
  
      // Extract only the premium flag from the request body
      const { premium } = req.body;
  
      if (!token) {
        res.status(401).json({ error: "Unauthorized: Please log in!" });
        return;
      }
  
      // Ensure the premium flag from the frontend is true
      if (premium !== true) {
        res.status(400).json({ error: "Invalid premium value. It must be true to promote a user." });
        return;
      }
  
      // Verify the JWT token
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
        return;
      }
  
      // Use the user ID from the token to locate the user in the database
      const userToPromote = await User.findById(decoded.id);
  
      if (!userToPromote) {
        res.status(404).json({ error: "User not found." });
        return;
      }
  
      // Check if the user is already a premium member
      if (userToPromote.isPremium) {
        res.status(400).json({ error: "User is already a premium member." });
        return;
      }
  
      // Promote the user to premium
      userToPromote.isPremium = true;
      await userToPromote.save();
  
      const newToken = jwt.sign({ id: userToPromote._id, username: userToPromote.username, isAdmin: userToPromote.isAdmin, isPremium: userToPromote.isPremium }, JWT_SECRET, { expiresIn: "1d" });
      res.status(200).json({ success: true, message: `User ${userToPromote.username} is now a premium member.`, token: newToken });
    } catch (error) {
      res.status(500).json({ error: "Failed to promote user to premium", details: (error as Error).message });
    }
};