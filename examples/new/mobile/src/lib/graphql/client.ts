import { Chain } from '../../zeus';
import { getGraphqlUrl } from './config';

export function createGraphqlClient(accessToken?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return Chain(getGraphqlUrl(), { headers });
}
