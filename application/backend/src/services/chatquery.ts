// services/chatbotService.ts
import axios from 'axios';

export interface ChatbotResponse {
  message: string;
}

/**
 * Calls the Gemini chatbot API with the provided query.
 * @param {string} query - The query to send to the Gemini chatbot.
 * @returns {Promise<string>} - The response from the Gemini chatbot.
 * @throws Will throw an error if the API call fails or if the API key is missing.
 */
// @ts-ignore
export async function callGeminiChatbot(query: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing from environment variables.");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: query }] }] };
  const headers = { 'Content-Type': 'application/json' };

  try {
    const response = await axios.post(endpoint, payload, { headers });
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response received from Gemini.";
  } catch (error: any) {
    console.error("Error calling Gemini:", error.response?.data || error.message);
    throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Handles the request to get a response from the chatbot.
 * @param {object} query - The query object containing the user's input.
 * @returns {Promise<ChatbotResponse>} - The response from the chatbot.
 */
export async function getChatbotResponse(query: { query: string }): Promise<ChatbotResponse> {
  let response: ChatbotResponse = { message: '' };
  try {
    const geminiResponse = await callGeminiChatbot(query.query);
    response.message = geminiResponse;
  } catch {
    response.message = "Error connecting to Gemini service.";
  }
  return response;
}
