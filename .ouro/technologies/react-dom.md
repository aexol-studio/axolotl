# react-dom — README (from repo)

# react-dom

React DOM is the official React renderer for the web. It pairs with the core react package to render components into the browser’s DOM and to produce HTML on the server.

- Client: mount and hydrate React trees in the browser.
- Server: stream HTML for Server-Side Rendering (SSR), with first-class Suspense support.
- Entry points: react-dom (common utilities), react-dom/client (client APIs), react-dom/server (server APIs).

Links to API docs:
- react-dom: https://react.dev/reference/react-dom
- react-dom/client: https://react.dev/reference/react-dom/client
- react-dom/server: https://react.dev/reference/react-dom/server


## Installation

```sh
npm install react react-dom
# or
yarn add react react-dom
# or
pnpm add react react-dom
```


## Quick Start

Client render (new apps):
```js
import { createRoot } from 'react-dom/client';

function App() {
  return <h1>Hello World</h1>;
}

const container = document.getElementById('root');
createRoot(container).render(<App />);
```

Hydration (SSR + client):
```js
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
```


## Key Features

- Modern client API
  - createRoot(container).render(element)
  - hydrateRoot(container, element) for hydrating server-rendered HTML

- Streaming Server Rendering (SSR)
  - Node.js: renderToPipeableStream(element)
  - Web/edge: renderToReadableStream(element)
  - Suspense-ready streaming for fast time-to-first-byte

- HTML generation and hydration support
  - Works with React features like Suspense, Transitions, and Actions (see react docs)
  - Integrates with React DOM resource handling (stylesheets, scripts, metadata)

- Clear entry points
  - react-dom: general reference docs
  - react-dom/client: browser mount/hydration APIs
  - react-dom/server: server render APIs for Node and Web Streams


## Configuration

- Import from the right entry point
  - Client: import { createRoot, hydrateRoot } from 'react-dom/client'
  - Server: import { renderToPipeableStream, renderToReadableStream } from 'react-dom/server'

- Error handling and options
  - Client APIs accept options (see API pages) to customize error reporting and hydration behavior.

- Version matching
  - Keep react and react-dom on the same version to avoid runtime errors.


## Common Pitfalls

- Legacy APIs removed
  - ReactDOM.render and ReactDOM.hydrate are removed in React 19+. Use createRoot and hydrateRoot.

- Mismatched versions
  - Different versions of react and react-dom can throw or behave unpredictably.

- Hydration mismatches
  - The HTML produced on the server must match the client render. Mismatches cause re-render or error logs. See: https://react.dev/reference/react-dom/client/hydrateRoot

- Container selection
  - Pass a real DOM container (a node you own) to createRoot/hydrateRoot. Don’t pass a node that React already manages elsewhere.


## Examples

Client-only application:
```js
// index.html: <div id="root"></div>

import { createRoot } from 'react-dom/client';

function App() {
  return <main>Welcome!</main>;
}

createRoot(document.getElementById('root')).render(<App />);
```

Hydrate server-rendered HTML:
```js
// server renders <div id="root">...App HTML...</div>

import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
```

Node.js streaming SSR (Express-style):
```js
import { renderToPipeableStream } from 'react-dom/server';
import express from 'express';
import App from './App';

const app = express();

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // HTML shell is ready to stream
      pipe(res);
    },
    onError(err) {
      console.error(err);