import request from 'supertest';
import express from 'express';
import fareRoute from '../../routes/fareRoute';
import * as fareRouteController from '../../controllers/fareRouteController';

jest.mock('../../controllers/fareRouteController');

describe('GET /api/fare-route', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/fare-route', fareRoute);

  it('should call getFareRoute controller when endpoint is hit', async () => {
    const mockHandler = jest.fn((_req, res) => res.status(200).json({ message: 'Mock success' }));
    (fareRouteController.getFareRoute as jest.Mock).mockImplementation(mockHandler);

    const response = await request(app)
      .get('/api/fare-route')
      .query({ start: 'Choa Chu Kang', end: 'Bishan' });

    expect(response.status).toBe(200);
    expect(fareRouteController.getFareRoute).toHaveBeenCalled();
  });
});
