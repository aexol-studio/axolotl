# node-fetch — README (from repo)

# node-fetch

A lightweight, spec-aligned Fetch API for Node.js with Node streams, compression, and useful server-side extensions.

- Current major: 3.x (Node.js ≥ 12.20.0)
- ESM-only (use import or dynamic import from CommonJS)
- v2 (CommonJS) docs: https://github.com/node-fetch/node-fetch/tree/2.x#readme

## Overview

node-fetch brings the WHATWG Fetch API to Node.js while keeping a server-first design:
- Stays close to window.fetch, with documented server-side differences.
- Uses native Node streams (Readable) for request/response bodies.
- Handles gzip/deflate/brotli automatically and converts text/json to UTF‑8.
- Adds practical controls for redirects, response size limits, agents, and backpressure.

See docs/v3-LIMITS.md for differences from browser fetch (e.g., absolute URLs, no cookie jar).

## Installation

- Stable (ESM, Node ≥ 12.20): npm install node-fetch
- Legacy CommonJS (v2): npm install node-fetch@2

## Quick Start

ESM:
```js
import fetch from 'node-fetch';

const res = await fetch('https://api.github.com/users/github');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
console.log(data.login);
```

CommonJS (dynamic import):
```js
// mod.cjs
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
```

Optional: set global fetch
```js
import fetch, { Headers, Request, Response } from 'node-fetch';
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}
```

## Key Features

- Spec-like API: fetch, Request, Response, Headers, Body helpers (text/json/blob/arrayBuffer/formData)
- Node streams for body I/O; supports piping and async iteration
- Compression decoding (gzip/deflate/br)
- Redirect handling with limits and manual mode
- Abortable via AbortController/AbortSignal
- Agent hooks for TLS, keep-alive, DNS, IPv4/IPv6, proxies (via custom agent function)
- Response size limiting and backpressure control (highWaterMark)
- TypeScript types bundled

## Configuration

fetch(url, options)
- url: absolute URL (e.g., https://example.com/)
- options (defaults shown):
```js
{
  method: 'GET',
  headers: {},          // same formats as new Headers(init)
  body: null,           // e.g. string, URLSearchParams, FormData, Blob/File, or a Node Readable stream
  redirect: 'follow',   // 'follow' | 'manual' | 'error'
  signal: null,         // AbortSignal

  // node-fetch extensions
  follow: 20,           // max redirects (0 = no follow)
  compress: true,       // enable gzip/deflate/br decoding
  size: 0,              // max response body size in bytes (0 = unlimited)
  agent: null,          // http(s).Agent instance or function (url) => agent
  highWaterMark: 16384, // internal stream buffer size
  insecureHTTPParser: false
}
```

Default headers (when applicable):
- Accept: */*
- Accept-Encoding: gzip, deflate, br (when compress: true)
- Content-Length: auto-calculated if known (not set for streams)
- Host: from target URL
- Transfer-Encoding: chunked (when body is a stream)
- User-Agent: node-fetch

Custom Agent (HTTP keep-alive across HTTP/HTTPS):
```js
import http from 'node:http';
import https from 'node:https';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const res = await fetch('https://example.com', {
  agent: url => url.protocol === 'http:' ? httpAgent : httpsAgent
});
```

Manual redirect note:
- redirect: 'manual' returns a basic response (not an opaque-redirect). Inspect Location and follow if desired.

HighWaterMark (clone caveat):
- Node streams buffer (~16KB) is much smaller than browsers; cloning large responses should be consumed in parallel or increase highWaterMark.

## Common Pitfalls

- ESM-only in v3: require() doesn’t work. Use ESM or dynamic import in CJS. If you must stay CJS, use node-fetch@2.
- Absolute URLs only: relative or protocol-relative URLs are rejected; use new URL() to build absolute URLs.
- No cookie jar: set-cookie isn’t stored. Read raw Set-Cookie headers and send Cookie headers yourself.
- HTTP errors aren’t thrown: fetch resolves for 3xx–5xx. Check response.ok or status and throw yourself.
- Streams/backpressure: use stream.pipeline or async iteration with error handling. Be careful with res.clone() and large bodies; consume in parallel or raise highWaterMark.
- No built-in timeout option: use AbortController or a helper like timeout-signal.
- statusText may be empty if server didn’t send it (spec-accurate).
- In Node <19, default agents don’t keep alive; configure agents for keep-alive if needed.
- Content-Length not set for streaming bodies; some servers require it.
- Cookies and credentials modes aren’t applicable server-side; many browser-only features are out of scope.

For error semantics, see docs/ERROR-HANDLING.md (AbortError vs FetchError vs system errors).

## Examples

GET text/HTML:
```js
import fetch from 'node-fetch';
const res = await fetch('https://example.com/');
const html = await res.text();
```

POST JSON:
```js
import fetch from 'node-fetch';
const body = { a: 1 };
const res = await fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
const data = await res.json();
```

POST form (URLSearchParams auto sets content-type):
```js
import fetch from 'node-fetch';
const params = new URLSearchParams();
params.append('a', 1);
const res = await fetch('https://httpbin.org/post', { method: 'POST', body: params });
```

Stream to file (with error-safe pipeline):
```js
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import fetch from 'node-fetch';

const pipe = promisify(pipeline);
const res = await fetch('https://github.githubassets.com/images/modules/logos_page/Octocat.png');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
await pipe(res.body, createWriteStream('./octocat.png'));
```

Async iterate a streaming response:
```js
import fetch from 'node-fetch';
const res = await fetch('https://httpbin.org/stream/3');
try {
  for await (const chunk of res.body) {
    console.log(chunk.toString());
  }
} catch (e) {
  console.error(e);
}
```

Manual error handling for HTTP status:
```js
import fetch from 'node-fetch';
const res = await fetch('https://httpbin.org/status/400');
if (!res.ok) {
  const body = await res.text();
  throw new Error(`HTTP ${res.status}: ${body}`);
}
```

Abort with timeout:
```js
import fetch, { AbortError } from 'node-fetch';

const controller = new AbortController();
const t = setTimeout(() => controller.abort(), 150);

try {
  const res = await fetch('https://example.com', { signal: controller.signal });
  await res.text();
} catch (e) {
  if (e instanceof AbortError) console.log('Request aborted');
} finally {
  clearTimeout(t);
}
```

Read Set-Cookie headers:
```js
import fetch from 'node-fetch';
const res = await fetch('https://example.com');
const cookies = res.headers.raw()['set-cookie'] || [];
```

Upload Blob/File/FormData:
```js
import fetch, { FormData, File, fileFromSync } from 'node-fetch';

const form = new FormData();
form.set('greeting', 'Hello');
form.set('file', new File([new Uint8Array([97,98,99])], 'abc.txt', { type: 'text/plain' }));
// or: form.set('file', fileFromSync('./input.txt', 'text/plain'));

const res = await fetch('https://httpbin.org/post', { method: 'POST', body: form });
const json = await res.json();
```

Manual redirect handling:
```js
import fetch from 'node-fetch';
const res = await fetch('https://httpbin.org/status/301', { redirect: 'manual' });
if (res.status === 301 || res.status === 302) {
  const location = new URL(res.headers.get('location'), res.url);
  const res2 = await fetch(location, { redirect: 'manual' });
}
```

## TypeScript

- v3 bundles types; no extra typings needed.
- For v2: npm install --save-dev @types/node-fetch@2.x

## Upgrading

- 3.x upgrade guide: docs/v3-UPGRADE-GUIDE.md
- 2.x upgrade guide: docs/v2-UPGRADE-GUIDE.md
- Known differences/limits: docs/v3-LIMITS.md, docs/v2-LIMITS.md
- Changelog: https://github.com/node-fetch/node-fetch/releases

## Links

- Repo: https://github.com/node-fetch/node-fetch
- README (v3): root README.md
- v2 docs: https://github.com/node-fetch/node-fetch/tree/2.x#readme
- Error handling: docs/ERROR-HANDLING.md
- Issues: https://github.com/node-fetch/node-fetch/issues
- License: MIT (LICENSE.md)