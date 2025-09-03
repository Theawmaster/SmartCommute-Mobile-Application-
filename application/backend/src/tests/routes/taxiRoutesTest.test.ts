import request from 'supertest';
import express from 'express';
import taxiRoutes from '../../routes/taxiRoutes'; // adjust path as needed

// Mock the controller so we isolate the route test
jest.mock('../../controllers/taxiController', () => ({
  getAvailableTaxisHandler: (_req: any, res: any) =>
    res.status(200).json([{ latitude: 1.3, longitude: 103.8 }])
}));

const app = express();
app.use(express.json());
app.use('/api/taxi', taxiRoutes);

describe('GET /api/taxi/taxi-availability', () => {
  it('should respond with 200 and mock taxi data', async () => {
    const res = await request(app).get('/api/taxi/taxi-availability?lat=1.3&lon=103.8');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { latitude: 1.3, longitude: 103.8 }
    ]);
  });
});
describe('GET /api/taxi/taxi-availability with missing parameters', () => {
  it('should respond with 200 and default taxi data', async () => {
    const res = await request(app).get('/api/taxi/taxi-availability');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { latitude: 1.3, longitude: 103.8 }
    ]);
  });
});
describe('GET /api/taxi/taxi-availability with invalid parameters', () => {
  it('should respond with 200 and default taxi data', async () => {
    const res = await request(app).get('/api/taxi/taxi-availability?lat=invalid&lon=invalid');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { latitude: 1.3, longitude: 103.8 }
    ]);
  });
}
);
