import { Request, Response } from 'express';
import { getChatbotResponseHandler } from '../../controllers/chatbotController';
import * as chatqueryService from '../../services/chatquery';

// Mock the chatqueryService to isolate the test
describe('getChatbotResponseHandler', () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with chatbot message using body.query', async () => {
    const mockReq = {
      body: { query: 'Hi Gemini' },
      query: {}
    } as unknown as Request;

    const mockResponse = { message: 'Hi from Gemini' };
    jest.spyOn(chatqueryService, 'getChatbotResponse').mockResolvedValue(mockResponse);

    await getChatbotResponseHandler(mockReq, mockRes);

    expect(chatqueryService.getChatbotResponse).toHaveBeenCalledWith({ query: 'Hi Gemini' });
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('should respond with chatbot message using query.query (GET style)', async () => {
    const mockReq = {
      body: {},
      query: { query: 'GET Gemini' }
    } as unknown as Request;

    const mockResponse = { message: 'GET from Gemini' };
    jest.spyOn(chatqueryService, 'getChatbotResponse').mockResolvedValue(mockResponse);

    await getChatbotResponseHandler(mockReq, mockRes);

    expect(chatqueryService.getChatbotResponse).toHaveBeenCalledWith({ query: 'GET Gemini' });
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('should return 400 if no query is provided', async () => {
    const mockReq = {
      body: {},
      query: {}
    } as unknown as Request;

    await getChatbotResponseHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'query is required' });
  });

  it('should handle errors and return 500', async () => {
    const mockReq = {
      body: { query: 'error' },
      query: {}
    } as unknown as Request;

    jest.spyOn(chatqueryService, 'getChatbotResponse').mockRejectedValue(new Error('API failure'));

    await getChatbotResponseHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to process chatbot query' });
  });
});
