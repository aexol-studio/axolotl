import { createDirectives } from './axolotl.js';
import { MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';

/**
 * Example directive implementation for the @resolver directive.
 *
 * This demonstrates the correct pattern for creating directives in Axolotl:
 * 1. Directive function receives (schema, getDirective) parameters
 * 2. Returns a mapper config object (NOT a schema)
 * 3. Uses getDirective() to check if field has the directive
 * 4. Wraps the resolver function to add runtime behavior
 *
 * Two phases of execution:
 * - STARTUP: The mapper function runs once per field during schema construction
 * - RUNTIME: The wrapped resolve function runs on every GraphQL request
 */
export default createDirectives({
  resolver: (schema, getDirective) => {
    return {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        // STARTUP PHASE: Check if this field has the @resolver directive
        const resolverDirective = getDirective(schema, fieldConfig, 'resolver')?.[0];

        if (!resolverDirective) {
          return fieldConfig; // No @resolver directive, skip transformation
        }

        // Get original resolver function
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Return field config with wrapped resolver
        return {
          ...fieldConfig,
          resolve: async (source, args, context, info) => {
            // RUNTIME PHASE: This runs every time the field is queried
            console.log(`🔄 [@resolver] Executing: ${info.parentType.name}.${info.fieldName}`);

            const result = await resolve(source, args, context, info);

            console.log(`✅ [@resolver] Completed: ${info.parentType.name}.${info.fieldName}`);

            return result;
          },
        };
      },
    };
  },
});
