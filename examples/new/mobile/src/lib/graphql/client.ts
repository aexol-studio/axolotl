import { Chain } from '../../zeus'
import { getGraphqlUrl } from './config'
import { useAuthStore } from '../../stores/authStore'

export function createGraphqlClient(accessToken?: string | null) {
  const resolvedAccessToken =
    accessToken ?? useAuthStore.getState().accessToken ?? null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (resolvedAccessToken) {
    headers.Authorization = `Bearer ${resolvedAccessToken}`
  }

  return Chain(getGraphqlUrl(), { headers })
}
