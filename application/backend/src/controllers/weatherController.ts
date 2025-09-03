import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const SINGAPORE_LAT = 1.3521;
const SINGAPORE_LON = 103.8198;

// Get current weather in Singapore
export const getWeather = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: SINGAPORE_LAT,
        lon: SINGAPORE_LON,
        appid: process.env.WEATHER_API_KEY,
        units: "metric",
      },
    });

    const weatherStatus = response.data.weather[0].description; // Gets current weather status
    const temperature = response.data.main.temp; // Temperature in Celsius
    const weatherIconStatus = response.data.weather[0].icon; // Gets current weather Icon status
    res.json({ weather: weatherStatus, temperature, weatherIcon: weatherIconStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};