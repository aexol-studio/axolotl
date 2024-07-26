export type ResolversUnknown<InputType> = {
  [x: string]: {
    [x: string]: (input: InputType, args?: any) => any | undefined | Promise<any | undefined>;
  };
};

export type DirectivesUnknown<DirectiveType> = {
  [x: string]: DirectiveType;
};

export type ObjectsUnknown<InputType, DirectiveType> = {
  resolvers: ResolversUnknown<InputType>;
  directives?: DirectivesUnknown<DirectiveType>;
};

export interface CustomHandler<InputType, ArgumentsType = unknown> {
  (input: InputType, args: ArgumentsType extends { args: infer R } ? R : never): any;
}
export interface CustomMiddlewareHandler<InputType> {
  (input: InputType): InputType;
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
