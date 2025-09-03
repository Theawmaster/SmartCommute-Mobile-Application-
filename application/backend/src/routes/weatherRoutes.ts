import express from "express";
import { getWeather } from "../controllers/weatherController";

const router = express.Router();

router.get("/currentweather", getWeather);

export default router;