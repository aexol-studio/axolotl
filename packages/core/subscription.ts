/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Internal class that wraps subscription resolver functions.
 * This enables detection of subscription resolvers via instanceof checks
 * in adapters, allowing them to be handled differently than regular resolvers.
 */
export class InternalSubscriptionHandler<InputType = any, ArgumentsType = unknown, ReturnType = any> {
  constructor(
    private handler: (
      input: InputType,
      args: ArgumentsType extends { args: infer R } ? R : ArgumentsType,
    ) => AsyncIterableIterator<ReturnType> | AsyncIterable<ReturnType>,
  ) {}

  /**
   * Subscribe method that gets called by the GraphQL adapter.
   * It forwards the call to the wrapped handler function.
   */
  subscribe(
    input: InputType,
    args: ArgumentsType extends { args: infer R } ? R : ArgumentsType,
  ): AsyncIterableIterator<ReturnType> | AsyncIterable<ReturnType> {
    return this.handler(input, args);
  }

  /**
   * Type guard to check if a value is an InternalSubscriptionHandler
   */
  static isSubscriptionHandler(value: any): value is InternalSubscriptionHandler {
    return value instanceof InternalSubscriptionHandler;
  }
}

/**
 * Helper function to create a subscription handler.
 * Wraps the provided async generator or subscription function
 * in an InternalSubscriptionHandler instance.
 *
 * @example
 * ```typescript
 * const resolvers = createResolvers({
 *   Subscription: {
 *     beerAdded: createSubscriptionHandler(async *(input, args) => {
 *       // Subscribe to events and yield values
 *       yield { beerAdded: newBeer };
 *     })
 *   }
 * });
 * ```
 */
export function createSubscriptionHandler<InputType = any, ArgumentsType = unknown, ReturnType = any>(
  handler: (
    input: InputType,
    args: ArgumentsType extends { args: infer R } ? R : ArgumentsType,
  ) => AsyncIterableIterator<ReturnType> | AsyncIterable<ReturnType>,
): InternalSubscriptionHandler<InputType, ArgumentsType, ReturnType> {
  return new InternalSubscriptionHandler(handler);
}
