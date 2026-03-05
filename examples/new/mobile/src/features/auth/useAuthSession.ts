import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createGraphqlClient } from '../../lib/graphql/client'
import { AppTypedError } from '../../lib/errors/normalizeError'
import { useAuthStore } from '../../stores/authStore'
import { authMeQueryKey } from './queryKeys'
import { isAuthInvalidationError, isNetworkLikeError } from './sessionPolicy'
import { clearTodoOfflineState } from '../todo/offlinePersistence'

const meSelector = {
  _id: true,
  email: true,
  createdAt: true,
} as const

const readMe = async (accessToken: string) => {
  const client = createGraphqlClient(accessToken)
  const data = await client('query')({
    user: {
      me: meSelector,
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

  const meQuery = useQuery({
    queryKey: authMeQueryKey,
    enabled: Boolean(accessToken),
    retry: 0,
    queryFn: async () => {
      if (!accessToken) {
        return null
      }

      try {
        return await readMe(accessToken)
      } catch (error) {
        if (isAuthInvalidationError(error)) {
          await handleAuthInvalidation()
          return null
        }

        if (isNetworkLikeError(error)) {
          return null
        }

        throw error
      }
    },
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: AuthCredentials) => {
      const client = createGraphqlClient(null)
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
        queryFn: () => readMe(nextAccessToken),
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: AuthCredentials) => {
      const client = createGraphqlClient(null)
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
        queryFn: () => readMe(nextAccessToken),
      })
    },
  })

  const logout = async () => {
    if (accessToken) {
      try {
        const client = createGraphqlClient(accessToken)
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
