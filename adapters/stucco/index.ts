import { FieldResolveInput } from 'stucco-js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

export const stuccoAdapter = (input: FieldResolveInput) => {
  const field = input.info.fieldName;
  const typeName = input.info.parentType;
  const type = typeName ? ('name' in typeName ? typeName.name : undefined) : undefined;
  return {
    field,
    type,
    isScalar: false,
    args: input.arguments,
  };
};

export const updateStuccoJson = (resolvers: Record<string, Record<string, unknown>>) => {
  const stuccoPath = path.join(process.cwd(), 'stucco.json');
  let currentStucco: {
    resolvers?: {
      [x: string]: {
        resolve: {
          name: string;
        };
      };
    };
  } = {};
  if (existsSync(stuccoPath)) {
    currentStucco = JSON.parse(readFileSync(stuccoPath, 'utf8'));
  }
  Object.entries(resolvers).map(([k, v]) => {
    if (v && typeof v === 'object') {
      Object.entries(v).map(([key, fn]) => {
        if (fn) {
          const theKey = `${k}.${key}`;
          currentStucco.resolvers ||= {};
          currentStucco.resolvers[theKey] = {
            resolve: {
              name: 'lib/index',
            },
          };
        }
      });
    }
  });
  writeFileSync(path.join(process.cwd(), 'stucco.json'), JSON.stringify(currentStucco, null, 4));
};
