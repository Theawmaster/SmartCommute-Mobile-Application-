import { Request, Response, NextFunction } from 'express';
import { getFareRoute } from '../../controllers/fareRouteController';
import * as geoUtils from '../../utils/geoUtils';
import * as fareRouteService from '../../services/farerouteService';

// Mocking the geocodeOneMap and fetchFareRouteFromOneMap functions
describe('getFareRoute', () => {
  const mockRequest = {
    query: {
      start: 'Orchard MRT',
      end: 'Raffles Place MRT'
    }
  } as unknown as Request;

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with routing data if inputs are valid and service succeeds', async () => {
    jest.spyOn(geoUtils, 'geocodeOneMap').mockResolvedValueOnce({ lat: 1.3, lng: 103.8 });
    jest.spyOn(geoUtils, 'geocodeOneMap').mockResolvedValueOnce({ lat: 1.29, lng: 103.85 });

    const mockRoutingData = {
      plan: {
        itineraries: [{ duration: 600 }]
      }
    };

    jest.spyOn(fareRouteService, 'fetchFareRouteFromOneMap').mockResolvedValue(mockRoutingData);

    await getFareRoute(mockRequest, mockResponse, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith(mockRoutingData);
  });

  it('should return 400 if start or end is missing', async () => {
    const badRequest = { query: { start: '' } } as unknown as Request;
    await getFareRoute(badRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Origin and destination are required.' });
  });

  it('should return 400 if geocoding fails for start', async () => {
    const request = { query: { start: 'Invalid Place', end: 'Raffles Place' } } as unknown as Request;
    jest.spyOn(geoUtils, 'geocodeOneMap').mockResolvedValueOnce(null);

    await getFareRoute(request, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Origin location not valid.' });
  });

  it('should handle service error and call next', async () => {
    jest.spyOn(geoUtils, 'geocodeOneMap').mockResolvedValueOnce({ lat: 1.3, lng: 103.8 });
    jest.spyOn(geoUtils, 'geocodeOneMap').mockResolvedValueOnce({ lat: 1.29, lng: 103.85 });
    jest.spyOn(fareRouteService, 'fetchFareRouteFromOneMap').mockRejectedValue(new Error('API Error'));

    await getFareRoute(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
