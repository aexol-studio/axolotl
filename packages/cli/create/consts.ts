export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl`;
type T = {
  [key in STARTERS]: {
    example: `beerpub-${key}`;
    repo: `axolotl-starter-${key}`;
    description: string;
  };
};

export type STARTERS = 'stucco' | 'yoga';
export const STARTER_DICT: T = {
  stucco: {
    example: 'beerpub-stucco',
    repo: 'axolotl-starter-stucco',
    description: 'stucco.js starter',
  },
  yoga: {
    example: 'beerpub-yoga',
    repo: 'axolotl-starter-yoga',
    description: 'GraphQL Yoga starter',
  },
};
