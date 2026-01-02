export { query } from './query';
export { mutation } from './mutation';
export { subscription } from './subscription';
export { createChain } from './client';

import { query } from './query';
import { mutation } from './mutation';

// Typed GraphQL helpers matching schema.graphql
export const gql = {
  query: {
    hello: async (): Promise<{ hello: string }> => {
      return query()({ hello: true });
    },
  },
  mutation: {
    echo: async (message: string): Promise<{ echo: string }> => {
      return mutation()({ echo: [{ message }, true] });
    },
  },
};
