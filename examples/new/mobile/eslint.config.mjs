import js from '@eslint/js'
import tseslint from 'typescript-eslint'

const runtimeFiles = ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}']
const runtimeIgnores = [
  '**/*.test.{ts,tsx}',
  '**/*.stories.{ts,tsx}',
  '**/__tests__/**',
  '**/__mocks__/**',
  '**/mocks/**',
]

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'coverage/**',
      '.storybook/**',
      'src/zeus/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      semi: 'off',
    },
  },
  {
    files: runtimeFiles,
    ignores: runtimeIgnores,
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression > TSAnyKeyword',
          message:
            "Avoid 'as any' in runtime sources. Use explicit types, narrowing, or typed helpers.",
        },
        {
          selector:
            'Property[key.name=/^(shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation)$/]',
          message:
            'Legacy shadow props are not allowed in runtime sources. Use theme shadows + boxShadow presets instead.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
