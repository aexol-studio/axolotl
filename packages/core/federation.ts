import { ResolversUnknown } from '@/types.js';
import { InternalSubscriptionHandler } from '@/subscription.js';
import { mergeSDLs } from 'graphql-js-tree';

export const mergeAxolotls = (...resolvers: ResolversUnknown<any>[]) => {
  const superGraphPrepare: Record<string, Record<string, Array<any>>> = {};
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

      // Check if any of the functions is a subscription handler
      const hasSubscription = subgraphFunctions.some(
        (fn) =>
          InternalSubscriptionHandler.isSubscriptionHandler(fn) || (fn && typeof fn === 'object' && 'subscribe' in fn),
      );

      if (hasSubscription) {
        // For subscriptions, just use the first one (subscriptions can't be merged)
        const subscriptionHandler = subgraphFunctions.find(
          (fn) =>
            InternalSubscriptionHandler.isSubscriptionHandler(fn) ||
            (fn && typeof fn === 'object' && 'subscribe' in fn),
        );
        superGraph[type][field] = subscriptionHandler;
      } else {
        // For regular resolvers, merge them
        superGraph[type][field] = async (...args: any[]) => {
          const results = await Promise.all(
            subgraphFunctions.map(async (subgraphFunction) => {
              return subgraphFunction(...args);
            }),
          );
          if (results.length === 1) return results[0];
          if (results.length > 1) {
            return mergeDeep({}, ...results);
          }
        };
      }
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
      `Federation conflict on Node.field pattern: ${result.errors
        .map(({ conflictingNode, conflictingField }) => {
          return `${conflictingNode}.${conflictingField}`;
        })
        .join('\n\n')}`,
    );
  }, '');
};
