/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateModels } from '@/gen.js';

interface CustomHandler<InputType, ArgumentsType = unknown> {
  (input: InputType, args: ArgumentsType extends { args: infer R } ? R : never): any;
}
interface CustomMiddlewareHandler<InputType> {
  (input: InputType): InputType;
}
export type ResolversUnknown<InputType> = {
  [x: string]: {
    [x: string]: (input: InputType, args?: any) => any | undefined | Promise<any | undefined>;
  };
};

export const AxolotlAdapter =
  <Inp>() =>
  <T>(fn: (passedResolvers: ResolversUnknown<Inp>, production?: boolean) => T) =>
    fn;

export { generateModels };

export const Axolotl = <
  Models,
  Inp,
  Resolvers = {
    [P in keyof Models]?: {
      [T in keyof Models[P]]?: CustomHandler<Inp, Models[P][T]>;
    };
  },
>({
  production,
  schemaPath,
  modelsPath,
}: {
  // input is only required for frameworks with external routing
  schemaPath: string;
  modelsPath: string;
  // Instead of controlling developer and production mode by some force envs we allow to control it however you want. Generators don't run on production
  production?: boolean;
}) => {
  type Handler = CustomHandler<Inp>;
  type MiddlewareHandler = CustomMiddlewareHandler<Inp>;

  const createResolvers = <Z>(k: Z | Resolvers) => k as Z;

  if (!production) {
    // We need to generate models for Axolotl to work this is called with CLI but also on every dev run to keep things in sync
    generateModels({ schemaPath, modelsPath });
  }

  const applyMiddleware = <Z>(
    r: Z | Resolvers,
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
  };
};
