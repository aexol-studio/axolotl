/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateModels } from '@/gen.js';

interface CustomHandler<InputType, ArgumentsType = unknown> {
  (input: InputType, args: ArgumentsType extends { args: infer R } ? R : never): any;
}
interface CustomMiddlewareHandler<InputType> {
  (input: InputType): InputType;
}

type ResolversUnknown<InputType> = {
  [x: string]: {
    [x: string]: (input: InputType, args?: any) => any | undefined | Promise<any | undefined>;
  };
};
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
  adapter,
  resolverGenerators,
  production,
  schemaPath,
  modelsPath,
}: {
  adapter: (inp: Inp) => {
    type?: string;
    field?: string;
    args?: object;
  };
  resolverGenerators?: Array<(resolvers: ResolversUnknown<Inp>) => void>;
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
    Object.entries(k).map(([key, value]) => {
      (r as Record<string, Record<string, Handler>>)[key][value as string] = (input: Inp) =>
        middlewares.reduce((a, b) => {
          return b(a);
        }, input);
    });
  };

  const sendResponse = (input: Inp, passedResolvers: Resolvers) => {
    if (!production) {
      // If we need to generate some files when resolvers are specified
      resolverGenerators?.forEach((rg) => rg(passedResolvers as ResolversUnknown<Inp>));
    }
    const { field, type, args } = adapter(input);
    if (!type) return null;
    if (!field) return null;
    const typeResolver = passedResolvers[type as keyof Resolvers];
    if (!typeResolver) {
      throw new Error(`Cannot find resolver for type: "${type}"`);
    }
    const fieldResolver = typeResolver[field as keyof typeof typeResolver];
    if (!fieldResolver) {
      throw new Error(`Cannot find resolver for type: "${type}" and field "${field}"`);
    }
    if (typeof fieldResolver !== 'function') {
      throw new Error('Axolotl resolver must be a function');
    }
    return fieldResolver(input, args);
  };

  const serve = (fn: (input: Inp) => Promise<any>) => {
    return fn;
  };

  return {
    createResolvers,
    applyMiddleware,
    sendResponse,
    serve,
  };
};
