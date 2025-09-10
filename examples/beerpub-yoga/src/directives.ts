import { createDirectives } from '@/src/axolotl.js';
import { defaultFieldResolver } from 'graphql';
import { YogaInitialContext } from 'graphql-yoga';
import { MapperKind } from '@graphql-tools/utils';

export default createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'auth');
      if (!directive) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig as any;
      return {
        ...fieldConfig,
        resolve: async (source: any, args: any, context: YogaInitialContext, info: any) => {
          const headerValue = context.request.headers.get('Auth');
          if (headerValue !== 'password') {
            throw new Error('You are not authorized');
          }
          return resolve(source, args, context, info);
        },
      } as any;
    },
  }),
  // Map @cache to cacheControl extensions for Yoga response-cache plugin
  cache: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const dir = getDirective(schema, fieldConfig, 'cache')?.[0] as { ttl?: number; scope?: 'PUBLIC' | 'PRIVATE' } | undefined;
      if (!dir) return fieldConfig;
      const ttl = dir.ttl ?? 60;
      const scope = dir.scope ?? 'PUBLIC';
      return {
        ...fieldConfig,
        extensions: {
          ...(fieldConfig as any).extensions,
          cacheControl: {
            ttl,
            scope,
          },
        },
      } as any;
    },
  }),
});
