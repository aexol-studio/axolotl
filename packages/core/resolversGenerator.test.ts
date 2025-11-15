import { describe, it } from 'node:test';
import * as assert from 'node:assert';
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
    const fileNames = files.map((f) => f.name);
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
    assert.ok(files.some((f) => f.name.includes('Query/')));
    assert.ok(files.some((f) => f.name.includes('Book/')));
  });

  it('should set replace:true for aggregator files', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const individualFile = files.find((f) => f.name === 'resolvers/Query/getAllBooks.ts');
    const typeAggregator = files.find((f) => f.name === 'resolvers/Query/resolvers.ts');
    const rootAggregator = files.find((f) => f.name === 'resolvers/resolvers.ts');

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

  it('should handle multiple fields with @resolver in same type', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
        favoriteBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);

    // Should have 2 individual files + 1 type aggregator + 1 root aggregator = 4 files
    assert.strictEqual(files.length, 4);

    const getAllBooksFile = files.find((f) => f.name === 'resolvers/Query/getAllBooks.ts');
    const favoriteBooksFile = files.find((f) => f.name === 'resolvers/Query/favoriteBooks.ts');

    assert.ok(getAllBooksFile);
    assert.ok(favoriteBooksFile);
  });

  it('should generate correct imports in type aggregator', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
        favoriteBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const typeAggregator = files.find((f) => f.name === 'resolvers/Query/resolvers.ts');

    assert.ok(typeAggregator);
    assert.ok(typeAggregator?.content.includes("import getAllBooks from './getAllBooks.js';"));
    assert.ok(typeAggregator?.content.includes("import favoriteBooks from './favoriteBooks.js';"));
    assert.ok(typeAggregator?.content.includes('...getAllBooks.Query,'));
    assert.ok(typeAggregator?.content.includes('...favoriteBooks.Query,'));
  });

  it('should generate correct imports in root aggregator', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
      type Book {
        relatedBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const rootAggregator = files.find((f) => f.name === 'resolvers/resolvers.ts');

    assert.ok(rootAggregator);
    assert.ok(rootAggregator?.content.includes("import Query from './Query/resolvers.js';"));
    assert.ok(rootAggregator?.content.includes("import Book from './Book/resolvers.js';"));
    assert.ok(rootAggregator?.content.includes('...Query,'));
    assert.ok(rootAggregator?.content.includes('...Book,'));
  });

  it('should generate resolver with TODO comment', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);
    const resolverFile = files.find((f) => f.name === 'resolvers/Query/getAllBooks.ts');

    assert.ok(resolverFile);
    assert.ok(resolverFile?.content.includes('// TODO: implement resolver for Query.getAllBooks'));
    assert.ok(resolverFile?.content.includes("throw new Error('Not implemented: Query.getAllBooks');"));
  });

  it('should use correct import paths', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
      }
    `;
    const files = generateResolvers(schema);

    const individualFile = files.find((f) => f.name === 'resolvers/Query/getAllBooks.ts');
    const typeAggregator = files.find((f) => f.name === 'resolvers/Query/resolvers.ts');
    const rootAggregator = files.find((f) => f.name === 'resolvers/resolvers.ts');

    // Individual field resolver: ../../axolotl.js
    assert.ok(individualFile?.content.includes("from '../../axolotl.js'"));

    // Type aggregator: ../../axolotl.js
    assert.ok(typeAggregator?.content.includes("from '../../axolotl.js'"));

    // Root aggregator: ../axolotl.js
    assert.ok(rootAggregator?.content.includes("from '../axolotl.js'"));
  });

  it('should ignore fields without @resolver directive', () => {
    const schema = `
      type Query {
        getAllBooks: [Book!]! @resolver
        ping: String
        pong: String!
      }
    `;
    const files = generateResolvers(schema);

    // Only getAllBooks should have a resolver file
    const getAllBooksFile = files.find((f) => f.name === 'resolvers/Query/getAllBooks.ts');
    const pingFile = files.find((f) => f.name === 'resolvers/Query/ping.ts');
    const pongFile = files.find((f) => f.name === 'resolvers/Query/pong.ts');

    assert.ok(getAllBooksFile);
    assert.strictEqual(pingFile, undefined);
    assert.strictEqual(pongFile, undefined);
  });
});
