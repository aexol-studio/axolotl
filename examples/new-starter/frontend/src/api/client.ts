import { Chain } from '../zeus/index';

export const createChain = () =>
  Chain('/graphql', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  });
