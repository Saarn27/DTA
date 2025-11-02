import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static(publicDir));

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set. API requests will fail.');
}

const ai = new GoogleGenAI({ apiKey });

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const contents = messages.map((message) => ({
    role: message.role === 'model' ? 'model' : 'user',
    parts: [{ text: message.content ?? '' }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    });

    const reply = response?.text;

    if (!reply) {
      return res.status(500).json({ error: 'The Gemini API returned an empty response.' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    const status = error?.status || 500;
    res.status(status).json({ error: 'Failed to generate a response from Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
