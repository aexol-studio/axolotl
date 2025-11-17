import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { inspectResolvers } from './inspect.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import * as path from 'node:path';

const TEST_DIR = path.join(process.cwd(), '.test-inspect');

describe('inspectResolvers', () => {
  // Helper to setup test files
  const setupTest = (schema: string, resolvers: string) => {
    // Clean up if exists
    try {
      rmSync(TEST_DIR, { recursive: true, force: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Ignore errors if directory doesn't exist
    }

    // Create test directory
    mkdirSync(TEST_DIR, { recursive: true });

    // Write schema
    const schemaPath = path.join(TEST_DIR, 'schema.graphql');
    writeFileSync(schemaPath, schema);

    // Write resolvers with unique timestamp to bust cache
    const timestamp = Date.now();
    const resolversPath = path.join(TEST_DIR, `resolvers-${timestamp}.js`);
    writeFileSync(resolversPath, resolvers);

    return { schemaPath, resolversPath };
  };

  const cleanup = () => {
    try {
      rmSync(TEST_DIR, { recursive: true, force: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Ignore errors if directory doesn't exist
    }
  };

  it('should find missing resolvers marked with @resolver', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        hello: String @resolver
        world: String
      }
    `;

    const resolvers = `
      export default {
        Query: {}
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0][0], 'Query');
      assert.strictEqual(result[0][1], 'hello');
      assert.strictEqual(result[0][2], 'missing');
    } finally {
      cleanup();
    }
  });

  it('should find stub resolvers that throw "Not implemented"', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        hello: String @resolver
      }
    `;

    const resolvers = `
      export default {
        Query: {
          hello: () => {
            throw new Error('Not implemented: Query.hello');
          }
        }
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0][0], 'Query');
      assert.strictEqual(result[0][1], 'hello');
      assert.strictEqual(result[0][2], 'stub');
    } finally {
      cleanup();
    }
  });

  it('should not report implemented resolvers', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        hello: String @resolver
        world: String
      }
    `;

    const resolvers = `
      export default {
        Query: {
          hello: () => 'Hello, World!'
        }
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      assert.strictEqual(result.length, 0);
    } finally {
      cleanup();
    }
  });

  it('should only check fields with @resolver directive', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        hello: String @resolver
        world: String
        foo: String
      }
    `;

    const resolvers = `
      export default {
        Query: {}
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      // Only 'hello' should be reported, not 'world' or 'foo'
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0][1], 'hello');
    } finally {
      cleanup();
    }
  });

  it('should handle multiple types with @resolver fields', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        books: [Book!]! @resolver
      }
      
      type Mutation {
        createBook: Book @resolver
      }
      
      type Book {
        relatedBooks: [Book!]! @resolver
      }
    `;

    const resolvers = `
      export default {
        Query: {
          books: () => { throw new Error('Not implemented: Query.books'); }
        },
        Mutation: {},
        Book: {
          relatedBooks: () => []
        }
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      // Should find Query.books (stub) and Mutation.createBook (missing)
      assert.strictEqual(result.length, 2);

      const queryBooks = result.find((r) => r[0] === 'Query' && r[1] === 'books');
      const mutationCreateBook = result.find((r) => r[0] === 'Mutation' && r[1] === 'createBook');

      assert.ok(queryBooks);
      assert.strictEqual(queryBooks[2], 'stub');

      assert.ok(mutationCreateBook);
      assert.strictEqual(mutationCreateBook[2], 'missing');
    } finally {
      cleanup();
    }
  });

  it('should return empty array when all resolvers implemented', async () => {
    const schema = `
      directive @resolver on FIELD_DEFINITION
      
      type Query {
        hello: String @resolver
        world: String @resolver
      }
    `;

    const resolvers = `
      export default {
        Query: {
          hello: () => 'Hello!',
          world: () => 'World!'
        }
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      assert.strictEqual(result.length, 0);
    } finally {
      cleanup();
    }
  });

  it('should handle schema without @resolver directives', async () => {
    const schema = `
      type Query {
        hello: String
        world: String
      }
    `;

    const resolvers = `
      export default {
        Query: {}
      };
    `;

    const { schemaPath, resolversPath } = setupTest(schema, resolvers);

    try {
      const result = await inspectResolvers(resolversPath, schemaPath);

      assert.strictEqual(result.length, 0);
    } finally {
      cleanup();
    }
  });
});
