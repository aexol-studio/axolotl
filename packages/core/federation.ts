import { ResolversUnknown } from '@/types.js';
import { mergeSDLs } from 'graphql-js-tree';

export const mergeAxolotls = (...resolvers: ResolversUnknown<any>[]) => {
  const superGraphPrepare: Record<string, Record<string, Array<(...args: any[]) => Promise<any>>>> = {};
  // prepare supergraph from baby axolotls.
  for (const resolver of resolvers) {
    for (const [type, fields] of Object.entries(resolver)) {
      for (const [field, resolverFn] of Object.entries(fields)) {
        superGraphPrepare[type] ||= {};
        superGraphPrepare[type][field] ||= [];
        superGraphPrepare[type][field].push(resolverFn);
      }
    }
  }
  const superGraph: ResolversUnknown<any> = {};

  for (const [type, fields] of Object.entries(superGraphPrepare)) {
    for (const [field, subgraphFunctions] of Object.entries(fields)) {
      superGraph[type] ||= {};
      superGraph[type][field] = async (...args: any[]) => {
        const results = await Promise.all(
          subgraphFunctions.map(async (subgraphFunction) => {
            return subgraphFunction(...args);
          }),
        );
        if (results.length === 1) return results[0];
        if (results.length > 1) {
          return mergeDeep({}, results);
        }
      };
    }
  }
  return superGraph;
};

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target: { [x: string]: any }, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const createSuperGraph = (...schemas: string[]) => {
  return schemas.reduce((a, b) => {
    if (!a) return b;
    const result = mergeSDLs(a, b);
    if (result.__typename === 'success') return result.sdl;
    throw new Error(
      result.errors
        .map(({ conflictingNode, conflictingField }) => {
          return `${conflictingNode}.${conflictingField}`;
        })
        .join('\n\n'),
    );
  }, '');
};
