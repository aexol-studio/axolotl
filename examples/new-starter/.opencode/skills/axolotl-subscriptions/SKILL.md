---
name: axolotl-subscriptions
description: Axolotl subscription handlers - async generators, yield patterns, PubSub integration, and federated subscription rules
---

## Subscriptions

### Defining Subscriptions in Schema

Add a `Subscription` type to your schema:

```graphql
type Subscription {
  countdown(from: Int): Int @resolver
  messageAdded: Message @resolver
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

### Creating Subscription Resolvers

**CRITICAL:** All subscription resolvers **MUST** use `createSubscriptionHandler` from `@aexol/axolotl-core`.

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    // Simple countdown subscription
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      // input is [source, args, context] - same as regular resolvers
      const [, , context] = input;

      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }
    }),

    // Event-based subscription with PubSub
    messageAdded: createSubscriptionHandler(async function* (input) {
      const [, , context] = input;
      const channel = context.pubsub.subscribe('MESSAGE_ADDED');

      for await (const message of channel) {
        yield message;
      }
    }),
  },
});
```

### Key Points

1. **Always use `createSubscriptionHandler`** - It wraps your async generator function
2. **Use async generators** - Functions with `async function*` that yield values
3. **Yield values directly** - GraphQL automatically wraps the yielded value in `{ [fieldName]: yieldedValue }` format
4. **Access context** - Same `[source, args, context]` signature as regular resolvers
5. **Works with GraphQL Yoga** - Supports both SSE and WebSocket transports

### CRITICAL: Subscription Return Format

GraphQL subscriptions automatically wrap yielded values. You should yield the **value directly**, NOT wrapped in the field name:

```typescript
// ✅ CORRECT - yield the value directly
createSubscriptionHandler(async function* () {
  yield { type: 'CREATED', todo: { _id: '123', content: 'Test' } };
  // GraphQL returns: { "data": { "todoUpdates": { "type": "CREATED", "todo": {...} } } }
});

// ❌ WRONG - do NOT wrap in field name
createSubscriptionHandler(async function* () {
  yield { todoUpdates: { type: 'CREATED', todo: {...} } };
  // This would result in: { "data": { "todoUpdates": { "todoUpdates": {...} } } }
});
```

The GraphQL layer handles the `{ data: { fieldName: ... } }` wrapping automatically.

### Example: Real-Time Counter

**Schema:**

```graphql
type Subscription {
  countdown(from: Int = 10): Int @resolver
}
```

**Resolver:**

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      console.log(`Starting countdown from ${from}`);

      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }

      console.log('Countdown complete!');
    }),
  },
});
```

**GraphQL Query:**

```graphql
subscription {
  countdown(from: 5)
}
```

### Example: PubSub Pattern

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';

export default createResolvers({
  Mutation: {
    sendMessage: async ([, , ctx], { text }) => {
      const message = {
        id: crypto.randomUUID(),
        text,
        timestamp: new Date().toISOString(),
      };

      // Publish event
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
        // Cleanup on disconnect
        await channel.unsubscribe();
      }
    }),
  },
});
```

### Federated Subscriptions

In federated setups, each subscription field should only be defined in **one module**:

```typescript
// ✅ CORRECT: Define in one module only
// users/schema.graphql
type Subscription {
  userStatusChanged(userId: String!): UserStatus @resolver
}

// ❌ WRONG: Multiple modules defining the same subscription
// users/schema.graphql
type Subscription {
  statusChanged: Status @resolver
}

// todos/schema.graphql
type Subscription {
  statusChanged: Status @resolver  # Conflict!
}
```

If multiple modules try to define the same subscription field, only the first one encountered will be used.
