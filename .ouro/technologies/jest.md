# jest — README (from repo)

# Jest

🃏 Jest is a batteries‑included JavaScript/TypeScript testing platform. It runs tests fast in parallel, ships with powerful mocking and snapshot testing, measures coverage, and has an immersive watch mode. It works with Node, browser-like (JSDOM), and custom environments, supports native ESM and TypeScript, and is highly extensible.

Note: Jest 30 requires Node 18+ and TypeScript 5.4+ (when using TS types). Some matchers aliases were removed and snapshots might change formatting when you upgrade. See Upgrading links at the end.

---

## Installation

Choose your package manager:

```bash
# npm
npm install --save-dev jest
# yarn
yarn add -D jest
# pnpm
pnpm add -D jest
```

Initialize a config:

```bash
# npm
npm init jest@latest
# yarn
yarn create jest
# pnpm
pnpm create jest
```

TypeScript (via Babel) setup:

```bash
npm i -D @babel/core babel-jest @babel/preset-env @babel/preset-typescript
```

Create babel.config.js:

```js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

Alternatively, use ts-jest if you want type‑checking at runtime:

```bash
npm i -D ts-jest @types/jest
npx ts-jest config:init
```

ESM projects can import Jest globals explicitly:

```ts
// ESM or when you disable injected globals
import {describe, expect, jest, test} from '@jest/globals';
```

---

## Quick Start

Create a simple module and test.

sum.js

```js
export function sum(a, b) {
  return a + b;
}
```

sum.test.js

```js
import {sum} from './sum';

test('adds 1 + 2 = 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Run:

```bash
npx jest
# or with npm scripts:
# package.json
# "scripts": { "test": "jest" }
npm test
```

---

## Key Features

- Zero‑config to start; add config as you grow
- Fast parallel runs, intelligent test selection, watch mode
- Powerful mocking:
  - `jest.fn`, `jest.spyOn`, `jest.mock`, `jest.requireActual`
  - ESM mocking via `jest.unstable_mockModule` + dynamic `import()`
  - Module path mapping with `moduleNameMapper`
- Snapshot testing with property matchers and interactive updates
- Fake timers (modern, Date/microtasks aware) and `requestAnimationFrame` support (`advanceTimersToNextFrame`)
- Code coverage via Babel or native V8
- First‑class TypeScript (via Babel or ts‑jest)
- ESM support (Node’s loader + dynamic imports; see ESM docs)
- Multi‑project runner, project sharding across machines (`--shard`)
- Extensibility: custom reporters, runners, serializers, watch plugins
- CI‑friendly: JSON output, GitHub Actions reporter, coverage thresholds

---

## Configuration

Jest looks for `jest.config.(js|ts|mjs|cjs|mts|cts|json)` or a "jest" key in package.json. Basic examples:

jest.config.js

```js
const {defineConfig} = require('jest');

module.exports = defineConfig({
  testEnvironment: 'node',        // default since Jest 27; use 'jsdom' for browser-like
  setupFilesAfterEnv: ['./test/setupTests.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  // Use babel-jest by default for .js/.ts/.tsx if you have a Babel config
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // CSS/modules, static assets, or path aliases:
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|mp4|mp3)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  fakeTimers: {
    // Modern timers (default in Jest 27+); customize behavior:
    enableGlobally: false,
    doNotFake: ['nextTick', 'performance'], // keep real versions
    timerLimit: 100_000,
  },
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
});
```

TypeScript config (jest.config.ts)

```ts
import {defineConfig} from 'jest';

export default defineConfig({
  // same as above
});
```

Multi‑project (monorepo) config

```js
module.exports = {
  projects: [
    '<rootDir>/packages/server/jest.config.js',
    '<rootDir>/packages/web/jest.config.js',
  ],
};
```

DOM tests

```js
module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // For jsdom 26, window.location behavior changed; pass options or use a custom env if needed
    url: 'https://example.test',
  },
};
```

Enable globals cleanup between test files (opt‑in)

```js
module.exports = {
  testEnvironmentOptions: {
    globalsCleanup: 'on', // 'soft' is the default in Jest 30
  },
};
```

GitHub Actions reporter

```js
module.exports = {
  reporters: ['default', 'github-actions'],
};
```

Sharding across machines (CI)

```bash
# Machine 1:
jest --shard=1/3
# Machine 2:
jest --shard=2/3
# Machine 3:
jest --shard=3/3
```

---

## Common Pitfalls and How to Avoid Them

- Test environment mismatch
  - Node is default; switch to `testEnvironment: 'jsdom'` for DOM APIs.
- ESM mocking
  - ESM static imports are evaluated before mocks. Use `jest.unstable_mockModule()` and dynamic `import()`:
    ```js
    jest.unstable_mockModule('./dep.js', () => ({ foo: jest.fn() }));
    const mod = await import('./dep.js');
    ```
  - See ECMAScript Modules docs for details and limitations.
- Hoisting of `jest.mock`
  - Calls are hoisted; factories must be top‑level and pure. Importing a mocked class to access its non‑mocked types? Use `jest.requireActual`.
- Mixing `done` with Promises/async
  - Do not both return a Promise and call `done`; choose one. In Jest 27+, this throws.
- Hanging tests / Open handles
  - Close servers, DB connections, timers, and child processes. Use `--detectOpenHandles`, `--runInBand`, and consider `globalsCleanup: 'on'`.
- Transforms for non‑standard syntax
  - JSX/TS/ESNext require Babel (babel‑jest) or ts‑jest. Otherwise you’ll see parse errors.
- Transpiling dependencies
  - Some packages ship uncompiled ESM/TS. Adjust `transformIgnorePatterns` to allow transforms:
    ```js
    transformIgnorePatterns: ['/node_modules/(?!(my-esm-pkg|@scope/es-utils)/)'],
    ```
- ModuleName mapping for assets/styles
  - Use `identity-obj-proxy` for CSS Modules, and a file mock for binary assets.
- Snapshot churn / updates
  - Property matchers (`expect.any`, `expect.stringContaining`) help stabilize snapshots. Use `npx jest -u` or interactive mode to update intentionally.
- Barrels impact performance
  - Barrel files reexporting large graphs can lead to heavy module load per test. Consider breaking them up or using tools like `babel-jest-boost`.
- Node core modules
  - Mock node core with `jest.mock('node:fs')` (or `'fs'`) explicitly; `__mocks__` is not auto‑applied for core.
- Changed CLI/config names
  - `--testPathPattern` → `--testPathPatterns` (and config `testPathPatterns`). See migration guide if upgrading to v30.
- Removed expect aliases
  - Use canonical names (`toHaveBeenCalled`, `toHaveReturnedWith`, etc.). ESLint plugin has an autofixer.

---

## Examples

### Mocking a dependency but using its real class/type

Bypass the mocked class by importing it via `requireActual`:

```js
jest.mock('node-fetch');

import fetch from 'node-fetch';
const {Response} = jest.requireActual('node-fetch');

test('createUser', async () => {
  fetch.mockResolvedValue(new Response('4'));
  // ...
});
```

### Spying with automatic cleanup (`using`)

```js
test('logs a warning', () => {
  using warnSpy = jest.spyOn(console, 'warn');
  doWarnThing();
  expect(warnSpy).toHaveBeenCalled();
});
```

### Fake timers (modern) + animation frames

```js
jest.useFakeTimers();

test('debounce + RAF', () => {
  const cb = jest.fn();
  schedule(cb);           // schedules setTimeout(…, 100) + requestAnimationFrame
  jest.advanceTimersByTime(100);
  jest.advanceTimersToNextFrame(); // runs RAF callbacks
  expect(cb).toHaveBeenCalled();
});
```

### Snapshot testing with property matchers

```js
test('serializes user', () => {
  const user = { id: 123, createdAt: new Date(), name: 'Ada' };
  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date),
  });
});
```

### Parameterized tests

```js
import each from 'jest-each';

each`
  a  | b  | sum
  ${1}|${2}|${3}
  ${2}|${3}|${5}
`('adds ($a + $b) = $sum, case %$', ({a, b, sum}) => {
  expect(a + b).toBe(sum);
});
```

### Sharding in CI (GitHub Actions)

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1/3, 2/3, 3/3]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx jest --shard ${{ matrix.shard }} --reporters=default --reporters=github-actions
```

### Multi‑project monorepo

```
root/
  packages/
    server/
      jest.config.js
    web/
      jest.config.js
  jest.config.js
```

root/jest.config.js

```js
module.exports = {
  projects: ['<rootDir>/packages/server', '<rootDir>/packages/web'],
};
```

### Mapping CSS and assets

test/__mocks__/fileMock.js

```js
module.exports = 'file-stub';
```

jest.config.js

```js
module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
};
```

### ESM test + mocking

```js
// my.test.mjs
import {jest, test, expect} from '@jest/globals';

jest.unstable_mockModule('./dep.mjs', () => ({ foo: jest.fn().mockReturnValue(42) }));
const mod = await import('./dep.mjs');

test('esm mock', () => {
  expect(mod.foo()).toBe(42);
});
```

### Using `@jest/globals` (no injected globals)

```js
import {describe, expect, jest, test} from '@jest/globals';

describe('sum', () => {
  test('works', () => {
    expect(1 + 2).toBe(3);
  });
});
```

### Retry flaky tests with a delay

```js
jest.retryTimes(3, {waitBeforeRetry: 250});

test('eventually succeeds', async () => {
  // ...
});
```

---

## CLI Essentials

Common commands:

```bash
# Run all tests
jest

# Watch mode (changed files)
jest --watch

# Watch all
jest --watchAll

# Pattern by file path
jest src/utils

# Pattern by test name
jest -t "should handle error"

# Only changed since last commit
jest -o

# Coverage (babel or v8)
jest --coverage

# List which tests would run
jest --listTests

# Detect open handles
jest --detectOpenHandles

# Shard
jest --shard=1/3

# Update snapshots
jest -u

# JSON output to file
jest --json --outputFile=report.json

# Show config
jest --showConfig
```

Full CLI reference: see docs/CLI.md.

---

## Troubleshooting

- No tests found
  - Check `testMatch`/`testRegex`/`testPathPatterns`. Ensure files end with `.test.[jt]s[x]?` or live in `__tests__`.
- Babel config ignored
  - Ensure `babel.config.js` (root) vs `.babelrc` scope is correct. `babel-jest` must be installed.
- ESM cannot be loaded
  - Verify Node supports ESM for your file type or configure `extensionsToTreatAsEsm`. Prefer dynamic `import()` for mocking.
- Type errors not reported
  - Use `ts-jest` or run `tsc --noEmit` in CI in addition to Jest.
- Flaky snapshots / jsdom differences
  - Stabilize with property matchers; set fixed dates; consider custom serializers; be aware of jsdom 26 behavior changes (e.g., window.location).
- Slow runs / high memory
  - Avoid barrel files; use `projects`; enable `globalsCleanup: 'on'`; reduce workers for CI; update `transformIgnorePatterns`; avoid unnecessary globals.

---

## Links

- Website & Docs: https://jestjs.io
  - Getting Started: https://jestjs.io/docs/getting-started
  - CLI Options: https://jestjs.io/docs/cli
  - Configuration: https://jestjs.io/docs/configuration
  - Expect API: https://jestjs.io/docs/expect
  - Jest Object API: https://jestjs.io/docs/jest-object
  - Timer Mocks: https://jestjs.io/docs/timer-mocks
  - Snapshot Testing: https://jestjs.io/docs/snapshot-testing
  - ECMAScript Modules: https://jestjs.io/docs/ecmascript-modules
  - Using with webpack: https://jestjs.io/docs/webpack
  - Using TypeScript: https://jestjs.io/docs/getting-started#using-typescript
- Migration Guides
  - Upgrade to Jest 30: https://jestjs.io/docs/upgrading-to-jest30
  - Upgrade to Jest 29: https://jestjs.io/blog/2022/08/25/jest-29
  - Upgrade to Jest 28: https://jestjs.io/blog/2022/04/25/jest-28
- Repository: https://github.com/jestjs/jest

---

## Appendix: Frequently Used Snippets

Custom resolver (e.g., to honor `browser` field):

```js
// resolver.js
const browserResolve = require('browser-resolve');
module.exports = browserResolve.sync;
```

jest.config.js:

```js
module.exports = {resolver: '<rootDir>/resolver.js'};
```

Custom snapshot serializer:

```js
// serializers/my-serializer.js
module.exports = {
  test: val => val && val.$$type === 'RichObject',
  serialize: (val, config, indentation, depth, refs, printer) =>
    `Rich(${printer(val.value, config, indentation, depth, refs)})`,
};

// jest.config.js
module.exports = {snapshotSerializers: ['<rootDir>/serializers/my-serializer.js']};
```

Protect global across files (when using globals cleanup):

```js
// test/setupGlobal.js
const {protectProperties} = require('jest-util');
protectProperties(globalThis.mySharedCache = new Map());
```

Happy Jesting!