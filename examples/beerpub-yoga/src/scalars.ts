import { createScalars } from '@/src/axolotl.js';
import { GraphQLScalarType } from 'graphql';

export default createScalars({
  URL: new GraphQLScalarType({
    name: 'URL',
    serialize(value) {
      return new URL((value as string).toString()).toString();
    },
    parseValue(value) {
      return value === null ? value : new URL(value as string);
    },
  }),
});
