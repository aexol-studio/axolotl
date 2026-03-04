jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));

import Constants from 'expo-constants';
import { getGraphqlUrl } from './config';

describe('getGraphqlUrl', () => {
  it('returns fallback url when config is missing', () => {
    expect(getGraphqlUrl()).toBe('http://localhost:4002/graphql');
  });

  it('returns configured url when provided', () => {
    (Constants as { expoConfig?: { extra?: { graphqlUrl?: string } } }).expoConfig = {
      extra: { graphqlUrl: 'https://api.axolotl.dev/graphql' },
    };

    expect(getGraphqlUrl()).toBe('https://api.axolotl.dev/graphql');
  });
});
