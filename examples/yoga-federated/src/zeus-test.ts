import {
  chainOptions,
  Zeus,
  ValueTypes,
  GraphQLTypes,
  InputType,
  decodeScalarsInResponse,
  VType,
  ScalarDefinition,
  OperationOptions,
  ExtractVariables,
  GenericOperation,
} from './zeus/index.js';
import { Ops, ReturnTypes } from './zeus/const.js';

// Types for SSE Subscription
type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;

export type SubscriptionToGraphQLSSE<Z, T, SCLR extends ScalarDefinition> = {
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: (fn?: () => void) => void;
  close: () => void;
};

type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR;
};

export type SubscriptionFunction = (query: string) => {
  on: (e: (args: unknown) => void) => void;
  off: (e: (args: unknown) => void) => void;
  error: (e: (args: unknown) => void) => void;
  open: (e?: () => void) => void;
  close: () => void;
};

// Core SSE subscription implementation
export const apiSubscriptionSSE = (options: chainOptions) => (query: string) => {
  const url = options[0];
  const fetchOptions = options[1] || {};

  let abortController: AbortController | null = null;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let onCallback: ((args: unknown) => void) | null = null;
  let errorCallback: ((args: unknown) => void) | null = null;
  let openCallback: (() => void) | null = null;
  let offCallback: ((args: unknown) => void) | null = null;

  const startStream = async () => {
    try {
      abortController = new AbortController();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...fetchOptions.headers,
        },
        body: JSON.stringify({ query }),
        signal: abortController.signal,
        ...fetchOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (openCallback) {
        openCallback();
      }

      reader = response.body?.getReader() || null;
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (offCallback) {
            offCallback({ data: null, code: 1000, reason: 'Stream completed' });
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6);
              const parsed = JSON.parse(data);

              if (parsed.errors) {
                if (errorCallback) {
                  errorCallback({ data: parsed.data, errors: parsed.errors });
                }
              } else if (onCallback && parsed.data) {
                onCallback(parsed.data);
              }
            } catch {
              if (errorCallback) {
                errorCallback({ errors: ['Failed to parse SSE data'] });
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'AbortError' && errorCallback) {
        errorCallback({ errors: [error.message || 'Unknown error'] });
      }
    }
  };

  return {
    on: (e: (args: unknown) => void) => {
      onCallback = e;
    },
    off: (e: (args: unknown) => void) => {
      offCallback = e;
    },
    error: (e: (args: unknown) => void) => {
      errorCallback = e;
    },
    open: (e?: () => void) => {
      if (e) {
        openCallback = e;
      }
      startStream();
    },
    close: () => {
      if (abortController) {
        abortController.abort();
      }
      if (reader) {
        reader.cancel();
      }
    },
  };
};

// Thunder implementation for SSE (mirrors SubscriptionThunder)
export const SubscriptionThunderSSE =
  <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    type CombinedSCLR = UnionOverrideKeys<SCLR, OVERRIDESCLR>;
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
    ) as SubscriptionToGraphQLSSE<Z, GraphQLTypes[R], CombinedSCLR>;
    if (returnedFunction?.on && options?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => {
          if (options?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

// Main export - fully typed SSE subscription
export const SubscriptionSSE = (...options: chainOptions) => SubscriptionThunderSSE(apiSubscriptionSSE(options));

// Example usage with full type safety
const main = async () => {
  const subscriptionSSE = SubscriptionSSE('http://localhost:4003/graphql/stream');
  const sub = subscriptionSSE('subscription');
  const { on, error, open, off, close } = sub({
    countdown: [{ from: 10 }, true],
  });
  open(() => {
    console.log('✓ SSE connection established');
  });
  on((data) => {
    console.log('📊 Countdown:', data.countdown);
    if (data.countdown === 0) {
      console.log('\n✓ Countdown complete, closing connection...');
      close();
    }
  });
  error((err) => {
    console.error('❌ SSE error:', err);
  });
  off((event) => {
    console.log('🔌 SSE connection closed:', event.reason || 'Unknown reason');
    process.exit(0);
  });
};

main().catch(console.error);
