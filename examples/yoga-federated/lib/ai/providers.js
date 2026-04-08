import { createOpenAI } from '@ai-sdk/openai';
export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export const gpt4o = openai('gpt-4o');
export const gpt4oMini = openai('gpt-4o-mini');
export const gpt35Turbo = openai('gpt-3.5-turbo');
//# sourceMappingURL=providers.js.map