export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl`;
type T = {
  [key in STARTERS]: {
    example: `beerpub-${key}`;
    repo: `axolotl-starter-${key}`;
    description: string;
  };
};

type STARTERS = 'stucco' | 'yoga';
export const STARTER_DICT: T = {
  stucco: {
    example: 'beerpub-stucco',
    repo: 'axolotl-starter-stucco',
    description: 'Starter with stucco',
  },
  yoga: {
    example: 'beerpub-yoga',
    repo: 'axolotl-starter-yoga',
    description: 'Starter with yoga',
  },
};
