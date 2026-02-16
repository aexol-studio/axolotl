// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const lintFiles = ['backend/src/**/*.{js,jsx,ts,tsx}', 'frontend/src/**/*.{js,jsx,ts,tsx}'];

const lintIgnores = ['**/zeus/**'];

export default defineConfig(
  {
    files: lintFiles,
    ignores: lintIgnores,
  },
  {
    ...eslint.configs.recommended,
    files: lintFiles,
    ignores: lintIgnores,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: lintFiles,
    ignores: lintIgnores,
  })),
);
