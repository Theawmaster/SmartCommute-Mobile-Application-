// backend/src/tests/busController.test.ts

import { getBusArrival } from '../../utils/busUtils'; // ✅ updated import path
import axios from 'axios';

jest.mock('axios');

describe('Bus Utils - getBusArrival', () => {
  beforeAll(() => {
    // Use modern fake timers to control system time
    jest.useFakeTimers({ now: Date.now() });
    jest.setSystemTime(new Date("2024-08-14T16:41:48+08:00")); // Simulated current time
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after test
  });

  it('should fetch and clean bus arrival data with formatted arrival times', async () => {
    const sampleResponse = {
      data: {
        "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival",
        "BusStopCode": "83139",
        "Services": [
          {
            "ServiceNo": "15",
            "Operator": "GAS",
            "NextBus": {
              "EstimatedArrival": "2024-08-14T16:41:48+08:00",
              "Load": "SEA",
              "Type": "SD",
              "Latitude": "1.3154918333333334",
              "Longitude": "103.9059125",
            },
            "NextBus2": {
              "EstimatedArrival": "2024-08-14T16:49:22+08:00",
              "Load": "SEA",
              "Type": "SD",
              "Latitude": "1.3309621666666667",
              "Longitude": "103.9034135",
            },
            "NextBus3": {
              "EstimatedArrival": "2024-08-14T17:06:11+08:00",
              "Load": "SEA",
              "Type": "SD",
              "Latitude": "1.344761",
              "Longitude": "103.94022316666667",
            }
          }
        ]
      }
    };

    (axios.get as jest.Mock).mockResolvedValue(sampleResponse);

    const result = await getBusArrival('83139', 1.3, 103.9);

    const expected = [
      {
        serviceNumber: "15",
        operator: "GAS",
        nextBuses: [
          {
            estimatedArrival: "arr", // 0 mins
            load: "SEA",
            type: "SD",
            latitude: "1.3154918333333334",
            longitude: "103.9059125"
          },
          {
            estimatedArrival: "8 mins",
            load: "SEA",
            type: "SD",
            latitude: "1.3309621666666667",
            longitude: "103.9034135"
          },
          {
            estimatedArrival: "24 mins",
            load: "SEA",
            type: "SD",
            latitude: "1.344761",
            longitude: "103.94022316666667"
          }
        ]
      }
    ];

    expect(result).toEqual(expected);
  });
});
