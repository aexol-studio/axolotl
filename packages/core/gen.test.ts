import test from 'node:test';
import { resolveFieldType } from './gen.js';
import { Options } from 'graphql-js-tree';
import * as assert from 'node:assert';

test('resolveFieldType', (t, done) => {
  const possibleVariants = {
    ['Person | undefined']: resolveFieldType('Person', {
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
    ['Array<Person | undefined> | undefined']: resolveFieldType('Person', {
      type: Options.array,
      nest: {
        type: Options.name,
        name: 'Person',
      },
    }),
    ['Array<Person | undefined>']: resolveFieldType('Person', {
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
