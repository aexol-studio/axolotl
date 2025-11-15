/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  InferAdapterType,
  CustomHandler,
  CustomMiddlewareHandler,
  ObjectsUnknown,
  InferAdapterTypeDirectives,
} from '@/types';
import { GraphQLScalarType } from 'graphql';
import { InternalSubscriptionHandler } from '@/subscription.js';

export const AxolotlAdapter =
  <Inp, Dir>() =>
  <T, Z>(fn: (objects: ObjectsUnknown<Inp, Dir>, options?: Z) => T) =>
    fn;

export const Axolotl =
  <ADAPTER extends (objects: ObjectsUnknown<any, any>) => any>(adapter: ADAPTER) =>
  <Models, ScalarModels = unknown, DirectiveModels = unknown>() => {
    type Inp = InferAdapterType<ADAPTER>;
    type Dir = InferAdapterTypeDirectives<ADAPTER>;
    type Resolvers = {
      [P in keyof Models]?: {
        [T in keyof Models[P]]?:
          | CustomHandler<Inp, Models[P][T], ScalarModels>
          | InternalSubscriptionHandler<Inp, Models[P][T]>;
      };
    };
    type Scalars = {
      [P in keyof ScalarModels]?: GraphQLScalarType;
    };
    type Directives = {
      [P in keyof DirectiveModels]?: Dir;
    };
    type Handler = CustomHandler<Inp>;
    type MiddlewareHandler = CustomMiddlewareHandler<Inp>;

    const createScalars = <Z extends Scalars>(
      k: Z & {
        [P in keyof Z]: P extends keyof Scalars ? Z[P] : never;
      },
    ) => k as Z;

    const createResolvers = <Z extends Resolvers>(
      k: Z & {
        [P in keyof Z]: P extends keyof Resolvers ? Z[P] : never;
      },
    ) => k as Z;

    const createDirectives = <Z extends Directives>(
      k: Z & {
        [P in keyof Z]: Dir;
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
          const oldResolver = (r as Record<string, Record<string, any>>)[typeName][fieldName];

          // Skip middleware for subscription handlers
          if (InternalSubscriptionHandler.isSubscriptionHandler(oldResolver)) {
            return;
          }
          if (oldResolver && typeof oldResolver === 'object' && 'subscribe' in oldResolver) {
            return;
          }

          // Apply middleware only to regular resolvers
          (r as Record<string, Record<string, Handler>>)[typeName][fieldName] = middlewares.reduce((a, b) => {
            return async (input, args) => {
              const middlewaredInput = await b(input);
              return a(middlewaredInput, args);
            };
          }, oldResolver as Handler);
        });
      });
    };
    return {
      createResolvers,
      createDirectives,
      createScalars,
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
export * from '@/federation.js';
export * from '@/subscription.js';
export * from '@/resolversGenerator.js';
