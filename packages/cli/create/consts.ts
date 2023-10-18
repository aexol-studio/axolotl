export const MESSAGE_BRAKE = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
export const BASE_REPOSITORY = `git@github.com:aexol-studio/axolotl.git`;
type T = {
  [key in STARTERS]: {
    example: string;
    repo: `axolotl-starter-${key}`;
    description: string;
  };
};

export type STARTERS = 'stucco' | 'yoga';

/**
 * ```
 * example: 'beerpub',
 * ```
 * folder name placed at examples folder
 * ```
 * repo: 'axolotl-starter-stucco',
 * ```
 * repository name
 * ```
 * description: 'stucco.js starter',
 * ```
 * description of starter
 * ```
 */
export const STARTER_DICT: T = {
  stucco: {
    example: 'beerpub',
    repo: 'axolotl-starter-stucco',
    description: 'stucco.js starter',
  },
  yoga: {
    example: 'beerpub-yoga',
    repo: 'axolotl-starter-yoga',
    description: 'GraphQL Yoga starter',
  },
};
