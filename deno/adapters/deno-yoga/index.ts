/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxolotlAdapter } from 'npm:@aexol/axolotl-core@^0.2.7';
import type { YogaInitialContext } from 'npm:graphql-yoga@^5.4.0';
import { createSchema, createYoga } from 'npm:graphql-yoga@^5.4.0';
import * as path from 'node:path';

// deno-lint-ignore no-explicit-any
export default AxolotlAdapter<[any, any, YogaInitialContext]>()((
  resolvers,
  options?: {
    yoga?: Parameters<typeof createYoga>[0];
    schema?: {
      options?: Parameters<typeof createYoga>[0]['schema'];
      file?: { path: string } | { content: string };
    };
  },
) => {
  const yogaResolvers = Object.fromEntries(
    Object.entries(resolvers).map(([typeName, v]) => {
      return [
        typeName,
        Object.fromEntries(
          Object.entries(v).map(([fieldName, resolver]) => {
            return [
              fieldName,
              // deno-lint-ignore no-explicit-any
              (_: any, args: any, context: YogaInitialContext) => {
                return resolver([_, args, context], args);
              },
            ];
          }),
        ),
      ];
    }),
  );

  const file = options?.schema?.file;
  const schema =
    file && 'content' in file
      ? file.content
      : Deno.readTextFileSync(path.join(Deno.cwd(), file?.path || './schema.graphql'));

  const yoga = createYoga({
    ...options?.yoga,
    schema: createSchema({
      ...options?.schema?.options,
      typeDefs: schema,
      resolvers: yogaResolvers,
    }),
  });
  return yoga;
});
