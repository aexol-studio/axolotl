/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResolversUnknown, InferAdapterType, CustomHandler, CustomMiddlewareHandler } from '@/types';

export const AxolotlAdapter =
  <Inp>() =>
  <T, Z>(fn: (passedResolvers: ResolversUnknown<Inp>, options?: Z) => T) =>
    fn;

export const Axolotl =
  <ADAPTER extends (passedResolvers: ResolversUnknown<any>) => any>(adapter: ADAPTER) =>
  <Models>() => {
    type Inp = InferAdapterType<ADAPTER>;
    type Resolvers = {
      [P in keyof Models]?: {
        [T in keyof Models[P]]?: CustomHandler<Inp, Models[P][T]>;
      };
    };
    type Handler = CustomHandler<Inp>;
    type MiddlewareHandler = CustomMiddlewareHandler<Inp>;

    const createResolvers = <Z extends Resolvers>(
      k: Z & {
        [P in keyof Z]: P extends keyof Resolvers ? Z[P] : never;
      },
    ) => k as Z;

    const applyMiddleware = <Z extends Resolvers>(
      r: Z & {
        [P in keyof Z]: P extends keyof Resolvers ? Z[P] : never;
      },
      middlewares: MiddlewareHandler[],
      k: {
        [P in keyof Z]?: {
          [Y in keyof Z[P]]?: true;
        };
      },
    ) => {
      Object.entries(k).forEach(([typeName, fields]) => {
        Object.keys(fields as Record<string, true>).forEach((fieldName) => {
          const oldResolver = (r as Record<string, Record<string, Handler>>)[typeName][fieldName];
          (r as Record<string, Record<string, Handler>>)[typeName][fieldName] = middlewares.reduce((a, b) => {
            return (input, args) => {
              const middlewaredInput = b(input);
              return a(middlewaredInput, args);
            };
          }, oldResolver);
        });
      });
    };
    return {
      createResolvers,
      applyMiddleware,
      adapter,
    };
  };

export const setSourceTypeFromResolver =
  <T extends (...args: any[]) => any | Promise<any>, R = ReturnType<T> extends Promise<infer RR> ? RR : ReturnType<T>>(
    fn: T,
  ) =>
  (source: any) => {
    return source as R;
  };

export * from '@/types.js';
export * from '@/chaos.js';
export * from '@/gen.js';
export * from '@/inspect.js';
