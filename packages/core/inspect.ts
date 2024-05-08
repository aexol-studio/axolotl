import { ResolversUnknown } from '@/types';
import { Parser, TypeDefinition } from 'graphql-js-tree';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

export const inspectResolvers = async (resolversPath: string, schemaPath = './schema.graphql') => {
  const resolvers = (await import(path.join(process.cwd(), resolversPath))).default as ResolversUnknown<any>;
  const fileContent = readFileSync(path.join(process.cwd(), schemaPath), 'utf8');
  const { nodes } = Parser.parse(fileContent);
  const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);
  console.log({ resolvers });
  const unImplemented = types.flatMap((t) =>
    t.args
      .map((a) => {
        const i = resolvers[t.name]?.[a.name] as () => void | undefined;
        if (!i) {
          return `${t.name}.${a.name}`;
        }
        return;
      })
      .filter(<T>(a: T | undefined): a is T => !!a),
  );
  unImplemented.forEach((ui) => {
    console.log(`${ui} is not implemented in resolvers passed to Axolotl`);
  });
};
