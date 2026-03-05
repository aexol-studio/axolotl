import { useQueryClient } from '@tanstack/react-query'

import {
  createGraphqlClient,
  useGqlMutation,
  useGqlQuery,
} from '../../lib/graphql'
import { AppTypedError } from '../../lib/errors/normalizeError'
import { useAuthStore } from '../../stores/authStore'
import { authMeQueryKey } from './queryKeys'
import { clearTodoOfflineState } from '../todo/offlinePersistence'
import { authorizedUserMeSelector } from '../../gql/selectors'
import type { FromSelector } from '../../zeus'

type AuthUser = FromSelector<
  typeof authorizedUserMeSelector,
  'AuthorizedUserQuery'
>['me']

const readMe = async (
  client: ReturnType<typeof createGraphqlClient>,
): Promise<AuthUser | null> => {
  const data = await client('query')({
    user: {
      ...authorizedUserMeSelector,
    },
  })

  return data.user?.me ?? null
}

type AuthCredentials = {
  email: string
  password: string
}

const isEmptyToken = (value: string) => value.trim().length === 0

export const useAuthSession = () => {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearSession = useAuthStore((state) => state.clearSession)
  const setLogoutReason = useAuthStore((state) => state.setLogoutReason)

  const performLocalSessionCleanup = async (
    reason: 'manual' | 'invalidated',
  ) => {
    clearSession()
    setLogoutReason(reason)
    queryClient.clear()
    await clearTodoOfflineState()
    queryClient.setQueryData(authMeQueryKey, null)
  }

  const handleAuthInvalidation = async () => {
    await performLocalSessionCleanup('invalidated')
  }

  const meQuery = useGqlQuery(
    authMeQueryKey,
    async (client) => {
      if (!accessToken) {
        return null
      }

      return readMe(client)
    },
    {
      enabled: Boolean(accessToken),
      retry: 0,
      createClient: () => createGraphqlClient({ accessToken }),
      errorHandling: {
        onAuthInvalidation: handleAuthInvalidation,
        fallback: {
          network: () => null,
        },
      },
    },
  )

  const loginMutation = useGqlMutation<string, AuthCredentials>(
    async (client, { email, password }) => {
      const data = await client('mutation')({
        login: [
          {
            email,
            password,
          },
          true,
        ],
      })

      return data.login
    },
    {
      onSuccess: async (nextAccessToken) => {
        if (isEmptyToken(nextAccessToken)) {
          throw new AppTypedError(
            'UNKNOWN_ERROR',
            'common.auth.invalidSessionToken',
          )
        }

        setAccessToken(nextAccessToken)
        await queryClient.fetchQuery({
          queryKey: authMeQueryKey,
          queryFn: () =>
            readMe(createGraphqlClient({ accessToken: nextAccessToken })),
        })
      },
      createClient: () => createGraphqlClient(),
    },
  )

  const registerMutation = useGqlMutation<string, AuthCredentials>(
    async (client, { email, password }) => {
      const data = await client('mutation')({
        register: [
          {
            email,
            password,
          },
          true,
        ],
      })

      return data.register
    },
    {
      onSuccess: async (nextAccessToken) => {
        if (isEmptyToken(nextAccessToken)) {
          throw new AppTypedError(
            'UNKNOWN_ERROR',
            'common.auth.invalidSessionToken',
          )
        }

        setAccessToken(nextAccessToken)
        await queryClient.fetchQuery({
          queryKey: authMeQueryKey,
          queryFn: () =>
            readMe(createGraphqlClient({ accessToken: nextAccessToken })),
        })
      },
      createClient: () => createGraphqlClient(),
    },
  )

  const logout = async () => {
    if (accessToken) {
      try {
        const client = createGraphqlClient({ accessToken })
        await client('mutation')({
          user: {
            logout: true,
          },
        })
      } catch {
        // backend logout is best-effort, local cleanup remains deterministic
      }
    }

    await performLocalSessionCleanup('manual')
  }

  return {
    accessToken,
    isAuthenticated: Boolean(accessToken),
    me: meQuery.data ?? null,
    meQuery,
    loginMutation,
    registerMutation,
    logout,
    handleAuthInvalidation,
  }
}
