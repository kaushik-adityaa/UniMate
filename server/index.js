import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  streamChatCompletion,
  testGeminiConnection,
  getGeminiClient,
} from './geminiService.js';

// Load .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
app.use(cors());

// Increase JSON payload limit for base64 image uploads (up to 15MB)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

/**
 * Health and status check
 * Indicates whether GEMINI_API_KEY is configured on the server
 */
app.get('/api/status', (req, res) => {
  dotenv.config();
  const isConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY.trim() !== 'your_gemini_api_key_here'
  );

  res.json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    tagline: 'Your Campus. Your Growth. Your UniMate.',
  });
});

/**
 * Test an API key (either saved or candidate key)
 */
app.post('/api/test-key', async (req, res) => {
  try {
    const keyToTest = req.body.apiKey || process.env.GEMINI_API_KEY;
    if (!keyToTest) {
      return res.status(400).json({ ok: false, error: 'No API key provided to test.' });
    }

    const result = await testGeminiConnection(keyToTest);
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || 'Error testing connection' });
  }
});

/**
 * Save API key to .env file for local development convenience
 */
app.post('/api/config/key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return res.status(400).json({ ok: false, error: 'Invalid API key format.' });
    }

    const cleanKey = apiKey.trim();

    // Verify key first
    const testResult = await testGeminiConnection(cleanKey);
    if (!testResult.ok) {
      return res.status(400).json({
        ok: false,
        error: `Key validation failed: ${testResult.error || 'Please check your key.'}`,
      });
    }

    // Write / update .env file
    const envPath = path.join(projectRoot, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('GEMINI_API_KEY=')) {
      envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${cleanKey}`);
    } else {
      envContent = `${envContent.trim()}\nGEMINI_API_KEY=${cleanKey}\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

    // Update current process env
    process.env.GEMINI_API_KEY = cleanKey;

    res.json({
      ok: true,
      message: 'Gemini API key verified and saved successfully!',
      model: testResult.model,
    });
  } catch (err) {
    console.error('Failed to save API key:', err);
    res.status(500).json({ ok: false, error: err.message || 'Failed to update .env file.' });
  }
});

/**
 * Primary Chat endpoint with Server-Sent Events (SSE) streaming support
 */
app.post('/api/chat', async (req, res) => {
  const { message, history = [], image = null, stream = true } = req.body;

  // Basic validation
  if ((!message || typeof message !== 'string' || !message.trim()) && !image) {
    return res.status(400).json({
      error: 'Message text or an image is required.',
    });
  }

  // Check if API key is present
  const client = getGeminiClient();
  if (!client) {
    return res.status(401).json({
      error: 'GEMINI_API_KEY_MISSING',
      message: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file or configure it in the Setup dialog.',
    });
  }

  const abortController = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  if (stream) {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      await streamChatCompletion({
        message: message ? message.trim() : 'Please inspect this image and provide helpful student guidance.',
        history,
        image,
        signal: abortController.signal,
        onChunk: (chunkText) => {
          res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
        },
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      if (err.message === 'CLIENT_ABORTED' || abortController.signal.aborted) {
        return res.end();
      }

      console.error('Gemini streaming error:', err.message);

      let errorMessage = 'An error occurred while generating the response.';
      let statusCode = 500;

      if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('403')) {
        errorMessage = 'Invalid Gemini API key. Please check your credentials.';
        statusCode = 401;
      } else if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = 'Gemini API quota exceeded or rate limit reached. Please wait a moment and try again.';
        statusCode = 429;
      } else if (err.message?.includes('Unsupported image type') || err.message?.includes('Image size exceeds')) {
        errorMessage = err.message;
        statusCode = 400;
      }

      res.write(`data: ${JSON.stringify({ error: errorMessage, statusCode })}\n\n`);
      res.end();
    }
  } else {
    // Non-streaming fallback
    let fullText = '';
    try {
      await streamChatCompletion({
        message: message ? message.trim() : 'Please inspect this image.',
        history,
        image,
        signal: abortController.signal,
        onChunk: (chunkText) => {
          fullText += chunkText;
        },
      });

      res.json({ reply: fullText });
    } catch (err) {
      console.error('Gemini error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate response.' });
    }
  }
});

// Production: Serve static client build if present
const distPath = path.join(projectRoot, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`[UniMate Server] Running on http://localhost:${PORT}`);
  console.log(`[UniMate Server] API Status: ${process.env.GEMINI_API_KEY ? 'API Key Configured' : 'No API Key Found'}`);
});
