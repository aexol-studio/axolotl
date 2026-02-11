import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { createResolvers } from '../../axolotl.js';
import { streamText, CoreMessage } from 'ai';
import { gpt4oMini } from '../../../ai/index.js';

export default createResolvers({
  Subscription: {
    aiChat: createSubscriptionHandler(async function* (_, { messages, system }) {
      if (!process.env.OPENAI_API_KEY) {
        yield { content: 'Error: OPENAI_API_KEY is not configured', done: true };
        return;
      }

      const result = streamText({
        model: gpt4oMini,
        messages: messages as CoreMessage[],
        system: system || 'You are a helpful assistant for the Axolotl application.',
      });

      for await (const chunk of result.textStream) {
        yield { content: chunk, done: false };
      }
      yield { content: '', done: true };
    }),
  },
});
