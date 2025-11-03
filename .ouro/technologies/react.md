# react — README (from repo)

# React

React is a JavaScript library for building user interfaces. It lets you describe UI with components, keeps your views in sync with state, and updates the DOM efficiently as data changes.

- Declarative UI: describe “what to show,” React handles the updates.
- Component-based: compose small, reusable pieces.
- Learn once, use anywhere: web (react-dom), native (React Native), server rendering and streaming.

Learn how to use React in your project: https://react.dev/learn


## Installation

Install the core React runtime and DOM renderer:

```sh
# npm
npm install react react-dom

# yarn
yarn add react react-dom
```

React 19 requires the new JSX transform and concurrent APIs (createRoot). See upgrade notes at https://react.dev/blog/2024/04/25/react-19-upgrade-guide.


## Quick Start

Render a component in the browser with createRoot:

```jsx
// index.jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Counter />);
```

Server-render a component to a stream (Node.js):

```js
// server.js
import { renderToPipeableStream } from 'react-dom/server';
import http from 'node:http';

function App() {
  return <div>Hello World</div>;
}

http.createServer((req, res) => {
  const stream = renderToPipeableStream(<App />, {
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
  });
}).listen(3000);
```

(See more server APIs below.)


## Key Features

- Modern concurrent rendering
  - createRoot/hydrateRoot (react-dom/client) for interruptible, responsive updates.
  - useTransition and useDeferredValue for splitting urgent vs. non-urgent updates.
  - Suspense for lazy code and data boundaries.

- Hooks for state and logic reuse (useState, useEffect, useMemo, useReducer, useRef, etc.).

- Forms and actions (React 19)
  - <form> action and useFormStatus integration for progressive enhancement flows.
  - Transitions can include async work and pending UI, with error handling.

- Streaming Server Rendering
  - renderToPipeableStream (Node streams) and renderToReadableStream (Web streams) to stream HTML.
  - prerender/resume APIs for partial pre-rendering and resuming.

- Server Components (React 19)
  - Full-stack React architecture is now stable for libraries. Framework support varies; consult your framework’s docs.

- First-class developer tooling
  - React DevTools for browser extensions and standalone debugging.
  - ESLint plugin for Rules of Hooks and best practices.


## Configuration

### Enforce Rules of Hooks (ESLint)

Install the official ESLint plugin and enable the recommended configuration to catch mistakes:

```sh
# npm
npm install eslint-plugin-react-hooks --save-dev

# yarn
yarn add --dev eslint-plugin-react-hooks
```

Flat config (eslint.config.js|ts):

```js
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,       // recommended rules
  // or reactHooks.configs.flat['recommended-latest'] for bleeding edge checks
]);
```

Legacy config (.eslintrc):

```json
{
  "extends": ["plugin:react-hooks/recommended"]
}
```

See full plugin docs: packages/eslint-plugin-react-hooks/README.md in this repo.


## Common Pitfalls and How to Avoid Them

- Use the concurrent root APIs
  - React 19 removed legacy ReactDOM.render and ReactDOM.hydrate. Use createRoot and hydrateRoot from react-dom/client.

- Keep React and React DOM versions in sync
  - Mismatched versions can throw runtime errors. Install matching major/minor versions of react and react-dom.

- Don’t break Rules of Hooks
  - Only call hooks at the top level of React function components or custom hooks, never inside loops/conditions or nested functions. Use the ESLint plugin to enforce.

- Don’t set state during render or inside useMemo
  - Setting state while rendering (or inside useMemo) can cause infinite loops. Trigger updates in event handlers, effects, or transitions instead.

- Prefer rendering derived values instead of storing them in state via effects
  - Values derived from props/state should usually be computed directly during render rather than maintained with an effect that sets state, to avoid extra commits