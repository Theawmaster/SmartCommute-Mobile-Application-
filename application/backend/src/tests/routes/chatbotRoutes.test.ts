import request from 'supertest';
import express from 'express';
import chatbotRoutes from '../../routes/chatbotRoutes';
import * as chatqueryService from '../../services/chatquery';

const app = express();
app.use(express.json());
app.use('/api/chatbot', chatbotRoutes);

describe('chatbotRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with chatbot message on POST /chat', async () => {
    const mockMessage = { message: 'Hello from Gemini!' };
    jest.spyOn(chatqueryService, 'getChatbotResponse').mockResolvedValue(mockMessage);

    const res = await request(app)
      .post('/api/chatbot/chat')
      .send({ query: 'Hello!' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockMessage);
  });

  it('should respond with chatbot message on GET /chat', async () => {
    const mockMessage = { message: 'Hello via GET!' };
    jest.spyOn(chatqueryService, 'getChatbotResponse').mockResolvedValue(mockMessage);

    const res = await request(app)
      .get('/api/chatbot/chat')
      .query({ query: 'Hello!' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockMessage);
  });

  it('should return 400 if no query provided', async () => {
    const res = await request(app).post('/api/chatbot/chat').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'query is required' });
  });
});
