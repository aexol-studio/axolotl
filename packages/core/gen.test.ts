import { Options } from 'graphql-js-tree';
import * as assert from 'node:assert';
import { test } from 'node:test';
import { resolveFieldType } from './gen.js';

test('resolveFieldType', (t, done) => {
  const possibleVariants = {
    ['Person | undefined | null']: resolveFieldType('Person', {
      type: Options.name,
      name: 'Person',
    }),
    ['Person']: resolveFieldType('Person', {
      type: Options.required,
      nest: {
        type: Options.name,
        name: 'Person',
      },
    }),
    ['Array<Person | undefined | null> | undefined | null']: resolveFieldType('Person', {
      type: Options.array,
      nest: {
        type: Options.name,
        name: 'Person',
      },
    }),
    ['Array<Person | undefined | null>']: resolveFieldType('Person', {
      type: Options.required,
      nest: {
        type: Options.array,
        nest: {
          type: Options.name,
          name: 'Person',
        },
      },
    }),
    ['Array<Person>']: resolveFieldType('Person', {
      type: Options.required,
      nest: {
        type: Options.array,
        nest: {
          type: Options.required,
          nest: {
            type: Options.name,
            name: 'Person',
          },
        },
      },
    }),
  };
  Object.entries(possibleVariants).forEach(([k, v]) => {
    assert.equal(k, v);
  });
  done();
});
