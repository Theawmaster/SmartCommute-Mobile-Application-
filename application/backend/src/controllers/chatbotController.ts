// controllers/chatbotController.ts
import { Request, Response } from 'express';
import { getChatbotResponse } from '../services/chatquery';

/**
 * Handles the request to get a response from the chatbot.
 * @param {Request} req - The request object containing the user's input.
 * @param {Response} res - The response object to send the result back to the client.
 */
// @ts-ignore
export const getChatbotResponseHandler = async (req: Request, res: Response): Promise<void> => {
  const query = req.body.query || req.query.query;

  if (!query) {
    res.status(400).json({ error: 'query is required' });
    return;
  }

  try {
    const response = await getChatbotResponse({ query });
    res.json(response);
  } catch {
    res.status(500).json({ error: 'Failed to process chatbot query' });
  }
};
