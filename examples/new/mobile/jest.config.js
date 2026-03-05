module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.expo/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^expo-modules-core$': '<rootDir>/test/mocks/expo-modules-core.js',
    '^expo-modules-core/src/polyfill/dangerous-internal$':
      '<rootDir>/test/mocks/expo-modules-core-dangerous-internal.js',
    '^expo/src/winter$': '<rootDir>/test/mocks/expo-winter.js',
    '^expo/src/winter/runtime.native$': '<rootDir>/test/mocks/expo-winter-runtime.js',
    '^expo/src/winter/installGlobal$': '<rootDir>/test/mocks/expo-winter-install-global.js',
    '^expo/virtual/streams$': '<rootDir>/test/mocks/expo-virtual-streams.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-modules-core|@expo-modules-core/.*)',
  ],
};
