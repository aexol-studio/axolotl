import { QueryCache, QueryClient } from '@tanstack/react-query'

import { authMeQueryKey } from '../../features/auth/queryKeys'
import { isAuthInvalidationError } from '../../features/auth/sessionPolicy'
import { clearTodoOfflineState } from '../../features/todo/offlinePersistence'
import { useAuthStore } from '../../stores/authStore'

const handleSessionInvalidation = async () => {
  const authState = useAuthStore.getState()
  authState.clearSession()
  authState.setLogoutReason('invalidated')
  await clearTodoOfflineState()
}

export function createQueryClient() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (!isAuthInvalidationError(error)) {
          return
        }

        void handleSessionInvalidation()
        queryClient.clear()
        queryClient.setQueryData(authMeQueryKey, null)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  })

  return queryClient
}
