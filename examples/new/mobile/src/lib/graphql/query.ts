import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { createGraphqlClient } from './client';

type GraphqlQueryKey = readonly [string, ...unknown[]];
type GraphqlClient = ReturnType<typeof createGraphqlClient>;

type QueryFactory<TData> = (client: GraphqlClient) => Promise<TData>;

export function useGraphqlQuery<TData>(
  queryKey: GraphqlQueryKey,
  makeRequest: QueryFactory<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData, GraphqlQueryKey>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    ...options,
    queryKey,
    queryFn: async () => {
      const client = createGraphqlClient();
      return makeRequest(client);
    },
  });
}
