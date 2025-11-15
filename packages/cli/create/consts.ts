export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl.git`;

export type STARTERS = 'new' | 'federation-yoga';
type T = {
  [key in STARTERS]: {
    example: string;
    repo: `axolotl-starter-${key}`;
    description: string;
    isDeno?: boolean;
  };
};

export const STARTER_DICT: T = {
  'federation-yoga': {
    example: 'examples/yoga-federated',
    repo: 'axolotl-starter-federation-yoga',
    description: 'GraphQL Yoga Federation starter',
  },
  new: {
    example: 'examples/new',
    repo: 'axolotl-starter-new',
    description: 'GraphQL Yoga starter',
  },
};
