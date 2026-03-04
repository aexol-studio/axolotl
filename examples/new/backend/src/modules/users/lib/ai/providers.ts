import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '@/src/config/env.js';

// Create OpenAI provider with configuration
export const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  // Optional: customize base URL if using Azure or other providers
  ...(OPENAI_BASE_URL ? { baseURL: OPENAI_BASE_URL } : {}),
});

// Export commonly used models for convenience
export const gpt4o = openai('gpt-4o');
export const gpt4oMini = openai('gpt-4o-mini');
export const gpt35Turbo = openai('gpt-3.5-turbo');
