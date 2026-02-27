import { createResolvers } from '../../axolotl.js';
import { GraphQLError } from 'graphql';

export default createResolvers({
  Query: {
    user: async (input) => {
      const context = input[2];
      if (!context.authUser) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
      }
      return {};
    },
  },
});
