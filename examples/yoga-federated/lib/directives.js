import { createDirectives } from './axolotl.js';
import { MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
export default createDirectives({
    resolver: (schema, getDirective) => {
        return {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const resolverDirective = getDirective(schema, fieldConfig, 'resolver')?.[0];
                if (!resolverDirective) {
                    return fieldConfig;
                }
                const { resolve = defaultFieldResolver } = fieldConfig;
                return {
                    ...fieldConfig,
                    resolve: async (source, args, context, info) => {
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
//# sourceMappingURL=directives.js.map