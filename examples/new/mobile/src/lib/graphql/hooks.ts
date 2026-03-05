import {
  UseQueryResult,
  UseMutationOptions,
  UseQueryOptions,
  UseSuspenseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useCallback, useMemo, useRef, useState } from 'react'

import { Chain } from '../../zeus'
import { useAuthStore } from '../../stores/authStore'
import { getGraphqlUrl } from './config'
import { classifyGraphqlError, GraphqlErrorKind } from './errorPolicy'

type GraphqlQueryKey = readonly [string, ...unknown[]]

export type GraphqlClient = ReturnType<typeof createGraphqlClient>

type GraphqlErrorHandler = (error: unknown) => void | Promise<void>

type GraphqlFallbackHandler<TData> = (error: unknown) => TData | Promise<TData>

type GraphqlErrorHandling<TData> = {
  onAuthInvalidation?: GraphqlErrorHandler
  onNetworkError?: GraphqlErrorHandler
  onUnknownError?: GraphqlErrorHandler
  onError?: (kind: GraphqlErrorKind, error: unknown) => void | Promise<void>
  fallback?: Partial<Record<GraphqlErrorKind, GraphqlFallbackHandler<TData>>>
}

type GraphqlClientFactory = () => GraphqlClient

const callIfPresent = async (
  handler: GraphqlErrorHandler | undefined,
  error: unknown,
) => {
  if (!handler) {
    return
  }

  await handler(error)
}

export const createDefaultGraphqlHeaders = (accessToken?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

export const createGraphqlClient = (options?: {
  accessToken?: string | null
  headers?: Record<string, string>
}) => {
  const resolvedAccessToken =
    options?.accessToken ?? useAuthStore.getState().accessToken ?? null

  const headers = {
    ...createDefaultGraphqlHeaders(resolvedAccessToken),
    ...(options?.headers ?? {}),
  }

  return Chain(getGraphqlUrl(), { headers })
}

export const executeGraphqlRequest = async <TData>(
  makeRequest: (client: GraphqlClient) => Promise<TData>,
  options?: {
    createClient?: GraphqlClientFactory
    errorHandling?: GraphqlErrorHandling<TData>
  },
) => {
  const client = options?.createClient?.() ?? createGraphqlClient()

  try {
    return await makeRequest(client)
  } catch (error) {
    const kind = classifyGraphqlError(error)
    const errorHandling = options?.errorHandling

    if (kind === 'auth-invalidation') {
      await callIfPresent(errorHandling?.onAuthInvalidation, error)
    } else if (kind === 'network') {
      await callIfPresent(errorHandling?.onNetworkError, error)
    } else {
      await callIfPresent(errorHandling?.onUnknownError, error)
    }

    if (errorHandling?.onError) {
      await errorHandling.onError(kind, error)
    }

    const fallback = errorHandling?.fallback?.[kind]
    if (fallback) {
      return fallback(error)
    }

    throw error
  }
}

type GraphqlQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, GraphqlQueryKey>,
  'queryKey' | 'queryFn'
> & {
  createClient?: GraphqlClientFactory
  errorHandling?: GraphqlErrorHandling<TData>
}

type QueryFactory<TData> = (client: GraphqlClient) => Promise<TData>

export const useGqlQuery = <TData>(
  queryKey: GraphqlQueryKey,
  makeRequest: QueryFactory<TData>,
  options?: GraphqlQueryOptions<TData>,
) => {
  return useQuery({
    ...options,
    queryKey,
    queryFn: () =>
      executeGraphqlRequest(makeRequest, {
        createClient: options?.createClient,
        errorHandling: options?.errorHandling,
      }),
  })
}

type GraphqlSuspenseQueryOptions<TData> = Omit<
  UseSuspenseQueryOptions<TData, Error, TData, GraphqlQueryKey>,
  'queryKey' | 'queryFn'
> & {
  createClient?: GraphqlClientFactory
  errorHandling?: GraphqlErrorHandling<TData>
}

export const useGqlSuspenseQuery = <TData>(
  queryKey: GraphqlQueryKey,
  makeRequest: QueryFactory<TData>,
  options?: GraphqlSuspenseQueryOptions<TData>,
) => {
  return useSuspenseQuery({
    ...options,
    queryKey,
    queryFn: () =>
      executeGraphqlRequest(makeRequest, {
        createClient: options?.createClient,
        errorHandling: options?.errorHandling,
      }),
  })
}

type LazyQueryFactory<TData, TVariables> = (
  client: GraphqlClient,
  variables: TVariables,
) => Promise<TData>

type GraphqlLazyQueryOptions<TData, TVariables> = Omit<
  GraphqlQueryOptions<TData>,
  'enabled'
> & {
  initialVariables?: TVariables
}

type GraphqlLazyQueryResult<TData, TVariables> = readonly [
  (variables: TVariables) => Promise<TData>,
  UseQueryResult<TData, Error> & {
    called: boolean
  },
]

const withLazyVariablesKey = <TVariables>(
  queryKey: GraphqlQueryKey,
  variables: TVariables,
) => [...queryKey, variables] as GraphqlQueryKey

export const useGqlLazyQuery = <TData, TVariables>(
  queryKey: GraphqlQueryKey,
  makeRequest: LazyQueryFactory<TData, TVariables>,
  options?: GraphqlLazyQueryOptions<TData, TVariables>,
): GraphqlLazyQueryResult<TData, TVariables> => {
  const queryClient = useQueryClient()
  const { initialVariables, ...queryOptions } = options ?? {}
  const [called, setCalled] = useState(Boolean(initialVariables))
  const [activeQueryKey, setActiveQueryKey] = useState<GraphqlQueryKey>(
    initialVariables
      ? withLazyVariablesKey(queryKey, initialVariables)
      : queryKey,
  )
  const variablesRef = useRef<TVariables | null>(initialVariables ?? null)

  const lazyQuery = useQuery({
    ...queryOptions,
    enabled: false,
    queryKey: activeQueryKey,
    queryFn: async () => {
      if (variablesRef.current === null) {
        throw new Error('Lazy query was executed without variables')
      }

      const variables = variablesRef.current

      return executeGraphqlRequest((client) => makeRequest(client, variables), {
        createClient: queryOptions.createClient,
        errorHandling: queryOptions.errorHandling,
      })
    },
  })

  const execute = useCallback(
    async (variables: TVariables) => {
      variablesRef.current = variables
      const nextQueryKey = withLazyVariablesKey(queryKey, variables)
      setCalled(true)
      setActiveQueryKey(nextQueryKey)

      return queryClient.fetchQuery({
        queryKey: nextQueryKey,
        queryFn: () =>
          executeGraphqlRequest((client) => makeRequest(client, variables), {
            createClient: queryOptions.createClient,
            errorHandling: queryOptions.errorHandling,
          }),
        staleTime: queryOptions.staleTime,
      })
    },
    [
      makeRequest,
      queryClient,
      queryKey,
      queryOptions.createClient,
      queryOptions.errorHandling,
      queryOptions.staleTime,
    ],
  )

  const result = useMemo(
    () => ({
      ...lazyQuery,
      called,
    }),
    [called, lazyQuery],
  )

  return [execute, result] as const
}

type MutationFactory<TData, TVariables> = (
  client: GraphqlClient,
  variables: TVariables,
) => Promise<TData>

type GraphqlMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  'mutationFn'
> & {
  createClient?: GraphqlClientFactory
  errorHandling?: GraphqlErrorHandling<TData>
}

export const useGqlMutation = <TData, TVariables>(
  makeRequest: MutationFactory<TData, TVariables>,
  options?: GraphqlMutationOptions<TData, TVariables>,
) => {
  return useMutation({
    ...options,
    mutationFn: (variables) =>
      executeGraphqlRequest((client) => makeRequest(client, variables), {
        createClient: options?.createClient,
        errorHandling: options?.errorHandling,
      }),
  })
}

export const useGraphqlQuery = useGqlQuery
export const useGraphqlSuspenseQuery = useGqlSuspenseQuery
export const useGraphqlLazyQuery = useGqlLazyQuery
export const useGraphqlMutation = useGqlMutation
