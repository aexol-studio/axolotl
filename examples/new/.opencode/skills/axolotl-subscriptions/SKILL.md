---
name: axolotl-subscriptions
description: Axolotl subscription handlers - async generators, yield patterns, PubSub integration, and federated subscription rules
---

## Subscription Resolvers

**CRITICAL:** Always use `createSubscriptionHandler` from `@aexol/axolotl-core`. Never use a raw `AsyncGenerator`.

### Async Generator + Yield Pattern

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      // input = [source, args, context] — same as regular resolvers
      for (let i = from ?? 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i; // yield the value directly — NOT { countdown: i }
      }
    }),
  },
});
```

### Schema Wiring

Subscriptions require a `Subscription` type in the schema AND the `subscription` key in the `schema` block:

```graphql
type Subscription {
  countdown(from: Int): Int! @resolver
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

### Yield Format Rule

Yield the **field value directly**. GraphQL wraps it automatically:

```typescript
// ✅ CORRECT
yield { type: 'CREATED', post: { _id: '123' } };
// → { "data": { "postUpdates": { "type": "CREATED", "post": {...} } } }

// ❌ WRONG — double-wraps the field name
yield { postUpdates: { type: 'CREATED', post: {...} } };
```

---

## PubSub Integration

```typescript
export default createResolvers({
  Mutation: {
    sendMessage: async ([, , ctx], { text }) => {
      const message = { id: crypto.randomUUID(), text, timestamp: new Date().toISOString() };
      await ctx.pubsub.publish('MESSAGE_ADDED', message);
      return message;
    },
  },
  Subscription: {
    messageAdded: createSubscriptionHandler(async function* (input) {
      const [, , ctx] = input;
      const channel = ctx.pubsub.subscribe('MESSAGE_ADDED');
      try {
        for await (const message of channel) {
          yield message;
        }
      } finally {
        await channel.unsubscribe(); // cleanup on disconnect
      }
    }),
  },
});
```

---

## Federated Subscriptions

- Define each subscription field in **exactly one module** — if multiple modules define the same field, only the first is used
- Do not split subscription logic across modules
