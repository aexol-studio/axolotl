import { Parser, TypeDefinition, ParserField } from 'graphql-js-tree';

const TAB = (n: number) =>
  new Array(n)
    .fill(1)
    .map(() => '  ')
    .join('');

export type GeneratedFile = {
  name: string;
  content: string;
  replace?: boolean;
};

type ResolverMap = {
  [typeName: string]: {
    fields: string[];
  };
};

/**
 * Check if a field has the @resolver directive
 */
const hasResolverDirective = (field: ParserField): boolean => {
  return field.directives?.some((d) => d.name === 'resolver') || false;
};

/**
 * Find all fields in a type that have the @resolver directive
 */
const findResolverFields = (node: ParserField): ParserField[] => {
  return node.args.filter(hasResolverDirective);
};

/**
 * Generate content for an individual field resolver file
 */
const generateFieldResolverContent = (typeName: string, fieldName: string): string => {
  return `import {createResolvers} from '../../axolotl.js';

export default createResolvers({ 
  ${typeName}: { 
    ${fieldName}: async ([parent, details, ctx], args) => {
      // TODO: implement resolver for ${typeName}.${fieldName}
      throw new Error('Not implemented: ${typeName}.${fieldName}');
    } 
  } 
});
`;
};

/**
 * Generate content for a type-level resolver aggregator
 */
const generateTypeResolverContent = (typeName: string, fieldNames: string[]): string => {
  const imports = fieldNames.map((fieldName) => `import ${fieldName} from './${fieldName}.js';`).join('\n');

  const spreads = fieldNames.map((fieldName) => `${TAB(2)}...${fieldName}.${typeName},`).join('\n');

  return `import {createResolvers} from '../../axolotl.js';
${imports}

export default createResolvers({ 
  ${typeName}: { 
${spreads}
${TAB(1)}} 
});
`;
};

/**
 * Generate content for the root resolver aggregator
 */
const generateRootResolverContent = (typeNames: string[]): string => {
  const imports = typeNames.map((typeName) => `import ${typeName} from './${typeName}/resolvers.js';`).join('\n');

  const spreads = typeNames.map((typeName) => `${TAB(1)}...${typeName},`).join('\n');

  return `import {createResolvers} from '../axolotl.js';
${imports}

export default createResolvers({
${spreads}
});
`;
};

/**
 * Generate resolver files from a GraphQL schema
 */
export const generateResolvers = (schemaContent: string): GeneratedFile[] => {
  const { nodes } = Parser.parse(schemaContent);

  // Build a map of types and their resolver fields
  const resolverMap: ResolverMap = {};

  // Filter for ObjectTypeDefinition nodes and find @resolver fields
  const objectTypes = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);

  for (const type of objectTypes) {
    const resolverFields = findResolverFields(type);

    if (resolverFields.length > 0) {
      resolverMap[type.name] = {
        fields: resolverFields.map((f) => f.name),
      };
    }
  }

  // If no resolvers found, return empty array
  const typeNames = Object.keys(resolverMap);
  if (typeNames.length === 0) {
    return [];
  }

  // Generate files
  const files: GeneratedFile[] = [];

  // Level 1: Individual field resolver files
  for (const [typeName, { fields }] of Object.entries(resolverMap)) {
    for (const fieldName of fields) {
      files.push({
        name: `resolvers/${typeName}/${fieldName}.ts`,
        content: generateFieldResolverContent(typeName, fieldName),
      });
    }
  }

  // Level 2: Type-level aggregator files
  for (const [typeName, { fields }] of Object.entries(resolverMap)) {
    files.push({
      name: `resolvers/${typeName}/resolvers.ts`,
      content: generateTypeResolverContent(typeName, fields),
      replace: true,
    });
  }

  // Level 3: Root aggregator file
  files.push({
    name: 'resolvers/resolvers.ts',
    content: generateRootResolverContent(typeNames),
    replace: true,
  });

  return files;
};
