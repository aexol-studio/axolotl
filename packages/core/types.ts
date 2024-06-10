export type ResolversUnknown<InputType> = {
  [x: string]: {
    [x: string]: (input: InputType, args?: any) => any | undefined | Promise<any | undefined>;
  };
};
export interface CustomHandler<InputType, ArgumentsType = unknown> {
  (input: InputType, args: ArgumentsType extends { args: infer R } ? R : never): any;
}
export interface CustomMiddlewareHandler<InputType> {
  (input: InputType): InputType;
}

export type InferAdapterType<ADAPTER extends (passedResolvers: ResolversUnknown<any>) => any> =
  Parameters<ADAPTER>[0] extends {
    [x: string]: {
      [y: string]: infer R;
    };
  }
    ? R extends (...args: any[]) => any
      ? Parameters<R>[0]
      : never
    : never;
