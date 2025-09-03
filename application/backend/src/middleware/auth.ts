import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Authentication Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // List of endpoints that do not require authentication
    const publicPaths = [
      "/api/auth/forgotPassword",
      "/api/auth/verifyForgotPassword",
      "/api/auth/changeForgotPassword"
    ];
    
    // If the request path matches any public path, skip authentication
    if (publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }
    
    // Otherwise, require an Authorization header with a valid token.
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };
      // Attach user info to the request object for later use.
      (req as any).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired. Please log in again." });
        return;
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Please log in first!" });
        return;
      } else {
        res.status(500).json({ message: "Server error during authentication." });
        return;
      }
    }
};