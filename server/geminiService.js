import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { UNIMATE_SYSTEM_PROMPT } from './systemPrompt.js';

// Supported vision & text models in order of priority
export function getCandidateModels() {
  return [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest',
    'gemini-1.5-flash',
  ].filter(Boolean);
}

/**
 * Validates and sanitizes image payload
 * @param {Object} image - { data: string, mimeType: string }
 * @returns {Object|null}
 */
export function validateImage(image) {
  if (!image || !image.data || !image.mimeType) return null;

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
  if (!allowedMimeTypes.includes(image.mimeType.toLowerCase())) {
    throw new Error(`Unsupported image type: ${image.mimeType}. Supported: JPEG, PNG, WEBP, GIF, HEIC.`);
  }

  // Strip data:image/...;base64, prefix if present
  let base64Data = image.data;
  if (base64Data.includes(',')) {
    base64Data = base64Data.split(',')[1];
  }

  // Approximate size check (base64 length * 0.75)
  const approximateSizeBytes = (base64Data.length * 3) / 4;
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (approximateSizeBytes > maxSizeBytes) {
    throw new Error('Image size exceeds 10MB limit. Please upload a smaller image.');
  }

  return {
    inlineData: {
      data: base64Data,
      mimeType: image.mimeType.toLowerCase(),
    },
  };
}

/**
 * Normalizes chat history for the Gemini API
 * Ensures alternating user / model roles and non-empty content
 */
export function formatConversationHistory(history = []) {
  const contents = [];
  let lastRole = null;

  for (const msg of history) {
    if (!msg || !msg.content || typeof msg.content !== 'string') continue;
    const trimmed = msg.content.trim();
    if (!trimmed) continue;

    const role = msg.role === 'user' ? 'user' : 'model';

    // Gemini requires alternating roles; if duplicate, combine
    if (role === lastRole && contents.length > 0) {
      contents[contents.length - 1].parts[0].text += `\n\n${trimmed}`;
    } else {
      contents.push({
        role,
        parts: [{ text: trimmed }],
      });
      lastRole = role;
    }
  }

  // Gemini chat history cannot end on 'user' before we append the new user message
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents.pop();
  }

  // Limit history window to last 14 messages to maintain low latency and context limits
  return contents.slice(-14);
}

/**
 * Initializes Gemini client
 */
export function getGeminiClient(customKey) {
  dotenv.config();
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Stream response from Gemini
 */
export async function streamChatCompletion({ message, history = [], image = null, onChunk, signal, apiKey }) {
  const client = getGeminiClient(apiKey);
  if (!client) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const validImagePart = image ? validateImage(image) : null;
  const formattedHistory = formatConversationHistory(history);

  // Prepare current user prompt parts
  const currentParts = [];
  if (validImagePart) {
    currentParts.push(validImagePart);
  }
  currentParts.push({ text: message });

  const fullContents = [
    ...formattedHistory,
    {
      role: 'user',
      parts: currentParts,
    },
  ];

  let lastError = null;

  for (const modelName of getCandidateModels()) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: UNIMATE_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const result = await model.generateContentStream({
        contents: fullContents,
      });

      for await (const chunk of result.stream) {
        if (signal?.aborted) {
          throw new Error('CLIENT_ABORTED');
        }
        const text = chunk.text();
        if (text) {
          onChunk(text);
        }
      }

      return { success: true, model: modelName };
    } catch (err) {
      lastError = err;
      if (err.message === 'CLIENT_ABORTED') {
        throw err;
      }
      // If error is model not found or deprecated, try next candidate model
      const msg = err.message || '';
      if (msg.includes('404') || msg.includes('not found') || msg.includes('unsupported')) {
        console.warn(`Model ${modelName} failed, trying fallback model...`);
        continue;
      }
      // For auth or rate limit errors, don't keep cycling models
      throw err;
    }
  }

  throw lastError || new Error('Failed to generate response with available Gemini models.');
}

/**
 * Verify an API key and test connection
 */
export async function testGeminiConnection(keyToTest) {
  const client = getGeminiClient(keyToTest);
  if (!client) {
    return { ok: false, error: 'API key is empty or not provided.' };
  }

  for (const modelName of getCandidateModels()) {
    try {
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello, reply with "UniMate Ready" if you can hear me.');
      const response = await result.response;
      return {
        ok: true,
        model: modelName,
        reply: response.text().trim(),
      };
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('API_KEY_INVALID') || msg.includes('403') || msg.includes('unauthorized') || msg.includes('expired')) {
        return { ok: false, error: 'Invalid or unauthorized Gemini API key. Please check your key in Google AI Studio.' };
      }
      // Try next model if 404
      if (msg.includes('404')) continue;
      return { ok: false, error: err.message || 'Failed to connect to Gemini API.' };
    }
  }

  return { ok: false, error: 'Could not connect with candidate Gemini models.' };
}
