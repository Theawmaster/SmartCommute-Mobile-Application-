import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { getNearbyTrainCrowd as fetchCrowdData } from '../utils/trainUtils';

import { RequestHandler } from 'express';

export const getNearbyTrainCrowdHandler: RequestHandler = async (req, res) => {
  try {
    const liveLatitude = Number(req.query.lat) || 1.34;
    const liveLongitude = Number(req.query.lon) || 103.68;
    const radius = Number(req.query.radius) || 2;

    const data = await fetchCrowdData(liveLatitude, liveLongitude, radius);
    res.status(200).json(data);
  } catch (error) {
    console.error("Train crowd fetch error:", error);
    res.status(500).json({ error: 'Failed to fetch nearby train crowd data' });
  }
};

export interface TrainCrowdData {
  station: string;
  crowdLevel: string;
  latitude: number;
  longitude: number;
}

