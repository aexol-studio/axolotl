import { ResolversUnknown } from '@/types';
import { Parser, ScalarTypes, TypeDefinition, compileType, getTypeName } from 'graphql-js-tree';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

export const inspectResolvers = async (resolversPath: string, schemaPath = './schema.graphql') => {
  const resolvers = (await import(path.join(process.cwd(), resolversPath))).default as ResolversUnknown<any>;
  const fileContent = readFileSync(path.join(process.cwd(), schemaPath), 'utf8');
  const { nodes } = Parser.parse(fileContent);
  const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);
  const unImplemented = types.flatMap((t) =>
    t.args
      .map((a) => {
        const i = resolvers[t.name]?.[a.name] as () => void | undefined;
        const typeName = getTypeName(a.type.fieldType);
        const isBuiltInScalar = (
          [ScalarTypes.Boolean, ScalarTypes.Float, ScalarTypes.ID, ScalarTypes.Int, ScalarTypes.String] as string[]
        ).includes(typeName);
        if (!i) {
          return [t.name, a.name, compileType(a.type.fieldType), isBuiltInScalar] as const;
        }
        return;
      })
      .filter(<T>(a: T | undefined): a is T => !!a),
  );
  return unImplemented;
};
