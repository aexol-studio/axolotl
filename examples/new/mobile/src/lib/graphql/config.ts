import Constants from 'expo-constants';

const fallbackUrl = 'http://localhost:4002/graphql';

export function getGraphqlUrl() {
  const value = Constants.expoConfig?.extra?.graphqlUrl;

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return fallbackUrl;
}
