import { SubscriptionSSE } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

// Subscription client - SSE-based real-time data
// Usage examples:
//
// Countdown subscription:
// const sub = subscription()({ countdown: [{ from: 10 }, true] })
//
// AI Chat subscription (streams AI responses):
// const sub = subscription()({
//   aiChat: [
//     {
//       messages: [{ role: 'user', content: 'Hello!' }],
//       system: 'You are a helpful assistant.'
//     },
//     { content: true, done: true }
//   ]
// })
// sub.on((data) => console.log(data.aiChat.content));
// sub.error((err) => console.error(err));
// sub.start();
export const subscription = () => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['token'] = token;
  }

  // Use current origin for SSE endpoint
  const host = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4102';
  const sseUrl = `${host}/graphql`;

  return SubscriptionSSE(sseUrl, { headers })('subscription');
};
