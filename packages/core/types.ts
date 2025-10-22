/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLScalarType } from 'graphql';

export type ResolverFunction<InputType> = (input: InputType, args?: any) => any | undefined | Promise<any | undefined>;

export type SubscriptionHandler<InputType, ArgumentsType = unknown> = {
  subscribe: (
    input: InputType,
    args: ArgumentsType extends { args: infer R } ? R : never,
  ) => AsyncGenerator<any> | Generator<any> | AsyncIterable<any>;
  resolve?: (payload: any) => any;
};

export type ResolverOrSubscription<InputType> = ResolverFunction<InputType> | SubscriptionHandler<InputType>;

export type ResolversUnknown<InputType> = {
  [x: string]: {
    [x: string]: ResolverOrSubscription<InputType>;
  };
};
export type ScalarsUnknown = {
  [x: string]: GraphQLScalarType;
};

export type DirectivesUnknown<DirectiveType> = {
  [x: string]: DirectiveType;
};

export type ObjectsUnknown<InputType, DirectiveType> = {
  resolvers: ResolversUnknown<InputType>;
  directives?: DirectivesUnknown<DirectiveType>;
  scalars?: ScalarsUnknown;
};

export interface CustomHandler<InputType, ArgumentsType = unknown> {
  (input: InputType, args: ArgumentsType extends { args: infer R } ? R : never): any;
}
export interface CustomMiddlewareHandler<InputType> {
  (input: InputType): Promise<InputType>;
}

export type InferAdapterType<ADAPTER extends (objects: ObjectsUnknown<any, any>) => any> =
  Parameters<ADAPTER>[0]['resolvers'] extends {
    [x: string]: {
      [y: string]: infer R;
    };
  }
    ? R extends (...args: any[]) => any
      ? Parameters<R>[0]
      : never
    : never;

export type InferAdapterTypeDirectives<ADAPTER extends (objects: ObjectsUnknown<any, any>) => any> =
  Parameters<ADAPTER>[0]['directives'] extends
    | {
        [x: string]: infer R;
      }
    | undefined
    ? R
    : never;
