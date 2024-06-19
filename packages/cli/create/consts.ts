export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl.git`;

type T = {
  [key in STARTERS]: {
    example: string;
    repo: `axolotl-starter-${key}`;
    description: string;
    isDeno?: boolean;
  };
};

export type STARTERS = 'stucco' | 'yoga' | 'apollo' | 'deno-yoga';

export const STARTER_DICT: T = {
  stucco: {
    example: 'examples/beerpub',
    repo: 'axolotl-starter-stucco',
    description: 'stucco.js starter',
  },
  yoga: {
    example: 'examples/beerpub-yoga',
    repo: 'axolotl-starter-yoga',
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
