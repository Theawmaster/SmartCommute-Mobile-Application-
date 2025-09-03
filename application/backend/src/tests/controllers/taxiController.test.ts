import { Request, Response } from 'express';
import { getAvailableTaxisHandler } from '../../controllers/taxiController';
import * as taxiService from '../../services/taxiService';

describe('getAvailableTaxisHandler', () => {
  const mockReq = {
    query: {
      lat: '1.35',
      lon: '103.75',
    }
  } as unknown as Request;

  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with taxi data including etaMinutes if service succeeds', async () => {
    const mockTaxiData = [
      { latitude: 1.35, longitude: 103.75, etaMinutes: 3 },
      { latitude: 1.36, longitude: 103.76, etaMinutes: 4 },
    ];

    jest.spyOn(taxiService, 'fetchAvailableTaxis').mockResolvedValue(mockTaxiData);

    await getAvailableTaxisHandler(mockReq, mockRes);

    expect(taxiService.fetchAvailableTaxis).toHaveBeenCalledWith(1.35, 103.75, 3000);
    expect(mockRes.json).toHaveBeenCalledWith(mockTaxiData);
  });

  it('should handle errors and return status 500', async () => {
    jest.spyOn(taxiService, 'fetchAvailableTaxis').mockRejectedValue(new Error('API failure'));

    await getAvailableTaxisHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch taxi data' });
  });
});
