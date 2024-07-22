/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  InferAdapterType,
  CustomHandler,
  CustomMiddlewareHandler,
  ObjectsUnknown,
  InferAdapterTypeDirectives,
} from '@/types';

export const AxolotlAdapter =
  <Inp, Dir>() =>
  <T, Z>(fn: (objects: ObjectsUnknown<Inp, Dir>, options?: Z) => T) =>
    fn;

export const Axolotl =
  <ADAPTER extends (objects: ObjectsUnknown<any, any>) => any>(adapter: ADAPTER) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  <Models, DirectiveModels>() => {
    type Inp = InferAdapterType<ADAPTER>;
    type Dir = InferAdapterTypeDirectives<ADAPTER>;
    type Resolvers = {
      [P in keyof Models]?: {
        [T in keyof Models[P]]?: CustomHandler<Inp, Models[P][T]>;
      };
    };
    type Directives = {
      [P in keyof DirectiveModels]?: Dir;
    };
    type Handler = CustomHandler<Inp>;
    type MiddlewareHandler = CustomMiddlewareHandler<Inp>;

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
      createDirectives,
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
