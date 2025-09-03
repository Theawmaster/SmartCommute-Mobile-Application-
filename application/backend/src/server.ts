import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes';
import authRoutes from "./routes/authRoutes";
import feedbackRoutes from './routes/feedbackRoutes';
import passwordRoutes from './routes/passwordRoutes';
import userRoutes from './routes/userRoutes';
import weatherRoutes from './routes/weatherRoutes';
import busRoutes from './routes/busRoutes';
import trainRoutes from './routes/trainRoutes';
import taxiRoutes from './routes/taxiRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import fareRoute from './routes/fareRoute';

// Testing Purposes
import authRoutesTest from './tests/routes/authRoutesTest';
import feedbackRoutesTest from './tests/routes/feedbackRoutesTest';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure: true in production with HTTPS
  })
);

// Connect to MongoDB 
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register routes
app.use("/api/auth", authRoutes); // For authentication-related routes
app.use("/api/admin", adminRoutes); // For admin-related routes
app.use("/api/feedback", feedbackRoutes); // For feedback-related routes
app.use("/api/password", passwordRoutes); // For password-related routes
app.use("/api/user", userRoutes); // For user-related routes
app.use('/api/taxi', taxiRoutes); // For taxi-related routes
app.use("/api/weather", weatherRoutes); // For weather-related routes
app.use('/api/bus', busRoutes); // For bus-related routes
app.use('/api/busstop', busRoutes); // For bus stop-related routes
app.use('/api/train', trainRoutes); // For train-related routes
app.use('/api/taxi', taxiRoutes); // For taxi-related routes
app.use('/api/chatbot', chatbotRoutes); // For chatbot-related routes
app.use('/api/fare-route', fareRoute); // For fare-related routes

// Testing Purposes for Routes
app.use('/api/test/auth', authRoutesTest); // For testing authentication-related routes
app.use('/api/test/feedback', feedbackRoutesTest); // For testing feedback-related routes

// Health check 
app.get('/', (_req, res) => {
  res.send('API is running');
});

// Mount the route files under a common path

// Note to run the server:
// 1. For bus arrivals: http://localhost:5001/api/bus/bus-arrival?busStopCode=46981
// 2. For nearby bus stops: http://localhost:5001/api/bus/nearby-bus-stops?lat=1.344104&lon=103.687252
// 2q. For bus stop details: http://localhost:5001/api/bus/01012
// 3. For nearby train crowd: http://localhost:5001/api/train/nearby-train-crowd?lat=1.344104&lon=103.687252&radius=2
// 4. For taxi availability: http://localhost:5001/api/taxi/taxi-availability?lat=1.344104&lon=103.687252

// 5. For weather: http://localhost:5001/api/weather/currentweather
// 6. For chatbot: - Run "npm start" -->
//  curl -X POST http://localhost:5001/api/chatbot/chat -H "Content-Type: application/json" -d '{
//   "query": "How do I get to Woodlands South from NTU?"
// }'

// 7. For registration: http://localhost:5001/api/auth/register
// 8. For login: http://localhost:5001/api/auth/login
// 9. For logout: http://localhost:5001/api/auth/logout
// 10. For email verification: http://localhost:5001/api/auth/verify/:token
// 11. For feedback submission: http://localhost:5001/api/auth/submitfeedback

// Start server
const PORT = process.env.PORT || '5001'; // port 5000 is used by the mongoose
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});