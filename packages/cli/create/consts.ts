export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl.git`;

export type STARTERS = 'yoga' | 'apollo' | 'deno-yoga' | 'federation-yoga';
type T = {
  [key in STARTERS]: {
    example: string;
    repo: `axolotl-starter-${key}`;
    description: string;
    isDeno?: boolean;
  };
};

export const STARTER_DICT: T = {
  yoga: {
    example: 'examples/beerpub-yoga',
    repo: 'axolotl-starter-yoga',
    description: 'GraphQL Yoga starter',
  },
  'federation-yoga': {
    example: 'examples/beerpub-yoga-federated',
    repo: 'axolotl-starter-federation-yoga',
    description: 'GraphQL Yoga starter',
  },
  'deno-yoga': {
    example: 'deno/examples/beerpub-yoga',
    repo: 'axolotl-starter-deno-yoga',
    description: 'GraphQL Yoga starter',
    isDeno: true,
  },
  apollo: {
    example: 'examples/beerpub-apollo-server',
    repo: 'axolotl-starter-apollo',
    description: 'GraphQL Apollo server starter',
  },
};
