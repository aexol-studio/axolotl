export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `https://github.com/aexol-studio/axolotl.git`;

export type STARTERS = 'new';
type T = {
  [key in STARTERS]: {
    example: string;
    repo: `axolotl-starter-${key}`;
    description: string;
    isDeno?: boolean;
  };
};

export const STARTER_DICT: T = {
  new: {
    example: 'examples/new',
    repo: 'axolotl-starter-new',
    description: 'GraphQL Yoga starter with micro-federation',
  },
};
