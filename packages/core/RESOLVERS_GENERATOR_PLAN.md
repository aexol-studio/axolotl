# Implementation Plan: resolversGenerator.ts

## Overview

Create a function that parses a GraphQL schema and generates resolver file scaffolding for fields marked with the `@resolver` directive.

## File Location

`packages/core/resolversGenerator.ts`

## Dependencies

- `graphql-js-tree` - for parsing GraphQL schema (already in use)
- Existing utilities from `gen.ts` (TAB, etc.)

## Core Functionality

### 1. Main Export Function: `generateResolvers`

```typescript
export const generateResolvers = (schemaContent: string): GeneratedFile[]
```

**Purpose**: Parse schema content and return array of files to generate

**Input**:

- `schemaContent`: GraphQL schema as string

**Output**: Array of `GeneratedFile` objects with structure:

```typescript
type GeneratedFile = {
  name: string; // relative path like "resolvers/Query/getAllBooks.ts"
  content: string; // file content
  replace?: boolean; // if true, overwrite existing file
};
```

**Purpose**: Parse schema and return array of files to generate

**Input**:

- `schemaPath`: Path to GraphQL schema file
- `outputDir`: Optional base directory for generated files (default: './src')

**Output**: Array of `GeneratedFile` objects with structure:

```typescript
type GeneratedFile = {
  name: string; // relative path like "resolvers/Query/getAllBooks.ts"
  content: string; // file content
  replace?: boolean; // if true, overwrite existing file
};
```

### 2. Schema Parsing Logic

**Steps**:

1. Parse schema with `Parser.parse(schemaContent)` from `graphql-js-tree`
2. Filter nodes to get Object Type Definitions (Query, Mutation, custom types)
3. For each type, find fields with `@resolver` directive

**Key Points**:

- Only process `TypeDefinition.ObjectTypeDefinition` nodes
- Check each field's `directives` array for `@resolver`
- Track which types have resolver fields for proper file generation
- The directive check: look for directives with `name === 'resolver'`

### 3. File Structure Generation

**Three levels of files**:

#### Level 1: Individual Field Resolvers

- **Path**: `resolvers/{TypeName}/{fieldName}.ts`
- **Example**: `resolvers/Query/getAllBooks.ts`
- **Content Template**:

```typescript
import {createResolvers} from '../../axolotl.js';

export default createResolvers({
  {TypeName}: {
    {fieldName}: async ([parent, details, ctx], args) => {
      // TODO: implement resolver
      throw new Error('Not implemented: {TypeName}.{fieldName}');
    }
  }
});
```

#### Level 2: Type-Level Resolver Aggregators

- **Path**: `resolvers/{TypeName}/resolvers.ts`
- **Example**: `resolvers/Query/resolvers.ts`
- **Content Template**:

```typescript
import {createResolvers} from '../../axolotl.js';
import {field1} from './{field1}.js';
import {field2} from './{field2}.js';
// ... imports for all fields

export default createResolvers({
  {TypeName}: {
    ...{field1}.{TypeName},
    ...{field2}.{TypeName},
    // ... spread all field resolvers
  }
});
```

- **Important**: Set `replace: true` to regenerate on schema changes

#### Level 3: Root Resolver Aggregator

- **Path**: `resolvers/resolvers.ts`
- **Example**: `resolvers/resolvers.ts`
- **Content Template**:

```typescript
import { createResolvers } from '../axolotl.js';
import Query from './Query/resolvers.js';
import Mutation from './Mutation/resolvers.js';
import Book from './Book/resolvers.js';
// ... imports for all types

export default createResolvers({
  ...Query,
  ...Mutation,
  ...Book,
  // ... spread all type resolvers
});
```

- **Important**: Set `replace: true` to regenerate on schema changes

### 4. Helper Functions

#### `findResolverFields(node: ParserField): ParserField[]`

- Filters fields that have `@resolver` directive
- Returns array of fields needing resolvers

#### `generateFieldResolverContent(typeName: string, fieldName: string): string`

- Generates content for individual field resolver file
- Handles import path calculation (../../axolotl.js)
- Adds TODO comment with proper context

#### `generateTypeResolverContent(typeName: string, fieldNames: string[]): string`

- Generates aggregator file for a type
- Imports all field resolvers
- Spreads them into single type object

#### `generateRootResolverContent(typeNames: string[]): string`

- Generates root aggregator
- Imports all type resolvers
- Spreads them into final export

#### `calculateImportPath(fromPath: string, toPath: string): string`

- Calculates relative import path
- Examples:
  - From `resolvers/Query/getAllBooks.ts` to `axolotl.js` = `../../axolotl.js`
  - From `resolvers/Query/resolvers.ts` to `axolotl.js` = `../../axolotl.js`
  - From `resolvers/resolvers.ts` to `axolotl.js` = `../axolotl.js`

### 5. Data Structure to Build

```typescript
type ResolverMap = {
  [typeName: string]: {
    fields: string[]; // field names with @resolver
  };
};
```

**Algorithm**:

1. Initialize empty `ResolverMap`
2. Iterate through schema nodes
3. For each ObjectTypeDefinition:
   - Find fields with @resolver directive
   - Add to map: `resolverMap[typeName] = { fields: [...fieldNames] }`
4. Generate files in order:
   - Individual field resolvers (no replace flag)
   - Type aggregators (replace: true)
   - Root aggregator (replace: true)

### 6. Error Handling

- Handle parser errors gracefully
- Return empty array if no @resolver directives found
- Validate @resolver is only used on fields (not types, args, etc.)

### 7. Export from index.ts

Add to `packages/core/index.ts`:

```typescript
export * from '@/resolversGenerator.js';
```

## Implementation Order

1. Define TypeScript types (`GeneratedFile`, `ResolverMap`)
2. Implement schema parsing and @resolver detection
3. Implement helper functions for content generation
4. Implement file path calculation logic
5. Implement main `generateResolvers` function
6. Add tests in `resolversGenerator.test.ts`
7. Export from index.ts

## Testing Strategy

Create `resolversGenerator.test.ts`:

````typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateResolvers } from './resolversGenerator.js';

describe('generateResolvers', () => {
  it('should parse @resolver directive from schema', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
        ping: String
      }
    `;
    const files = generateResolvers(schema);
    // Should have: Query/getAllBooks.ts, Query/resolvers.ts, resolvers/resolvers.ts
    assert.strictEqual(files.length, 3);
  });

  it('should generate correct file structure', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const fileNames = files.map(f => f.name);
    assert.ok(fileNames.includes('resolvers/Query/getAllBooks.ts'));
    assert.ok(fileNames.includes('resolvers/Query/resolvers.ts'));
    assert.ok(fileNames.includes('resolvers/resolvers.ts'));
  });

  it('should handle multiple types with resolvers', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
      type Book {
        relatedBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    assert.ok(files.some(f => f.name.includes('Query/')));
    assert.ok(files.some(f => f.name.includes('Book/')));
  });

  it('should set replace:true for aggregator files', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const individualFile = files.find(f => f.name === 'resolvers/Query/getAllBooks.ts');
    const typeAggregator = files.find(f => f.name === 'resolvers/Query/resolvers.ts');
    const rootAggregator = files.find(f => f.name === 'resolvers/resolvers.ts');

    assert.strictEqual(individualFile?.replace, undefined);
    assert.strictEqual(typeAggregator?.replace, true);
    assert.strictEqual(rootAggregator?.replace, true);
  });

  it('should return empty array when no @resolver directives', () => {
    const schema = `
      type Query {
        ping: String
      }
    `;
    const files = generateResolvers(schema);
    assert.strictEqual(files.length, 0);
  });
});

## CLI Integration

The CLI (`packages/cli/index.ts`) should call this function:

```typescript
import { generateResolvers } from '@aexol/axolotl-core';

// In generate command
const files = generateResolvers({
  schemaPath: config.schema,
  outputDir: './src',
});

// Write files to disk
files.forEach((file) => {
  const fullPath = path.join(outputDir, file.name);
  if (file.replace || !existsSync(fullPath)) {
    mkdirSync(path.dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, file.content);
  }
});
````

## Edge Cases to Handle

1. **No @resolver directives**: Return empty array
2. **@resolver on non-field**: Should be ignored (only check field directives)
3. **Duplicate field names**: Should work fine (different types)
4. **Empty types**: Skip types with no @resolver fields
5. **Federation types**: Handle `@key`, `@external` etc. alongside @resolver

## Future Enhancements

1. Support for custom resolver templates
2. Support for TypeScript types in generated files
3. Generate resolver types based on schema types
4. Add JSDoc comments to generated resolvers
5. Support for arguments type hints in generated code

## Notes

- Follow existing code style from `gen.ts`
- Use 2-space indentation (TAB helper)
- Keep consistent with existing axolotl patterns
- The `createResolvers` function is already available from axolotl setup
- Resolver signature: `async ([parent, details, ctx], args) => { ... }`
- Core package should NOT handle file I/O - that's CLI's responsibility
- Function is pure: same input always produces same output
