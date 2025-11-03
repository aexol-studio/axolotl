# tailwindcss — README (from repo)

# Tailwind CSS

Overview
- Utility‑first CSS framework for rapidly building custom UIs.
- v4 focuses on speed (microsecond incremental builds), zero/low config, and a CSS‑first workflow (configure in CSS, not JS).
- Bundles modern CSS features: cascade layers, registered custom properties (@property), color-mix, container queries, and more.
- First‑party integrations:
  - @tailwindcss/vite: Vite plugin with optimal dev/production behavior.
  - @tailwindcss/postcss: PostCSS plugin with built‑in @import and url() rewriting.
  - Standalone/browser builds (oxide/wasm) for special environments.

Installation
Choose the path that matches your toolchain.

- Vite
  - npm: npm i -D tailwindcss @tailwindcss/vite
  - pnpm: pnpm add -D tailwindcss @tailwindcss/vite
  - yarn: yarn add -D tailwindcss @tailwindcss/vite
- PostCSS
  - npm: npm i -D tailwindcss @tailwindcss/postcss
  - pnpm: pnpm add -D tailwindcss @tailwindcss/postcss
  - yarn: yarn add -D tailwindcss @tailwindcss/postcss
- Other environments
  - Standalone CLI and browser builds exist; see tailwindcss.com for current guidance.

Quick Start
Minimal Vite setup

1) Install: npm i -D tailwindcss @tailwindcss/vite
2) vite.config.ts:
```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```
3) Create a CSS entry (e.g., src/index.css) containing:
```css
@import "tailwindcss";
```
4) Import that CSS in your app entry (e.g., main.tsx) and use utilities:
```html
<div class="p-6 rounded-lg bg-gray-800 text-white">
  Hello Tailwind
</div>
```

Minimal PostCSS setup

1) Install: npm i -D tailwindcss @tailwindcss/postcss
2) postcss.config.js:
```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [tailwindcss()],
}
```
3) In your CSS entry:
```css
@import "tailwindcss";
```
4) Build via your bundler or postcss pipeline.

Key Features
- High‑performance engine with extremely fast incremental builds.
- CSS‑first configuration:
  - Customize design tokens in CSS via @theme and native CSS variables.
  - Use @import "tailwindcss" to include Tailwind without a JS config.
  - Use @reference to import configuration details without duplicating CSS.
- Automatic content detection:
  - Tailwind scans your source files automatically to generate just the CSS you use.
  - Adjustable via @source rules or source(...) annotation on @import/@tailwind.
- Modern CSS utilities and variants:
  - Container queries, 3D transforms, expanded gradients, text/drop/inset shadows.
  - Variants like not-*, @starting-style, noscript, inverted-colors, pointer-* and more.
- First‑party build plugins:
  - @tailwindcss/vite: tight integration with Vite dev and build.
  - @tailwindcss/postcss: handles @import, rewrites url(...), and integrates Lightning CSS optimization.
- Production optimization using Lightning CSS (minification, autoprefixing behavior).

Configuration
CSS-first theming
- Define or override tokens in CSS using @theme. Common namespaces include:
  - --color-*
  - --text-* (font sizes)
  - --leading-* (line heights)
  - --tracking-* (letter spacing)
  - --font-* (font families, weights via --font-weight-*)
  - --ease-* (timing functions)
  - --container-* (container sizes)
  - --breakpoint-* (for screen utilities)
  - --spacing (multiplier for derived spacing scale)
Example:
```css
@theme {
  /* Spacing scale multiplier */
  --spacing: 0.25rem;

  /* Colors */
  --color-brand: oklch(0.70 0.20 250);
  --color-brand-foreground: oklch(0.98 0.02 250);

  /* Fonts */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Container defaults */
  --container-3xl: 80rem;
}
```

Automatic source detection
- Tailwind auto-detects templates (JS/TS/JSX/TSX/HTML/… files) and ignores common vendor/build folders by default (e.g., node_modules, .next, .svelte-kit, .turbo, etc. per CHANGELOG).
- Control detection:
  - Add @source rules to include/exclude sources.
  - Annotate your Tailwind entry with a base path for detection:
    ```css
    @import "tailwindcss" source("./src");
    ```
  - Disable auto detection if your framework handles it: source(none)

Using @reference
- Import Tailwind configuration details (variables, keyframes, etc.) without generating utilities twice:
```css
@reference "path/to/your/entry.css";
```

@tailwindcss/postcss options (packages/@tailwindcss-postcss/README.md)
- base: set the directory used for source scanning
```js
import tailwindcss from '@tailwindcss/postcss'
import path from 'node:path'

export default {
  plugins: [
    tailwindcss({
      base: path.resolve(__dirname, './app'),
    }),
  ],
}
```
- optimize: enable/disable Lightning CSS (minify, transforms). By default enabled in production (NODE_ENV=production).
```js
tailwindcss({
  // Disable all Lightning CSS optimization
  optimize: false,

  // Or enable but disable minification
  optimize: { minify: false },
})
```
- transformAssetUrls: control url(...) rewriting (enabled by default). Disable if your bundler already rewrites URLs.
```js
tailwindcss({
  transformAssetUrls: false, // or true (default)
})
```

@tailwindcss/vite options (packages/@tailwindcss-vite/README.md)
- optimize: toggle Lightning CSS behavior in production:
```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      optimize: false,              // disable optimization
      // or
      // optimize: { minify: false } // keep transforms, skip minify
    }),
  ],
})
```

Common Pitfalls
- Missing Tailwind entrypoint in CSS:
  - Ensure your CSS includes @import "tailwindcss"; (or the equivalent @tailwind directives) otherwise no utilities are generated.
- Nothing scanned in dev:
  - Some integrations only scan sources if Tailwind features are present in the CSS (e.g., @import "tailwindcss" or @tailwind utilities).
- Duplicate or conflicting url(...) rewriting:
  - If your bundler already rewrites URLs in CSS, set transformAssetUrls: false in @tailwindcss/postcss to avoid double processing.
- Production minification surprises:
  - Lightning CSS is enabled by default in production for both plugins. If you hit edge cases, temporarily disable with optimize: false or optimize: { minify: false }.
- Ignored files not being scanned:
  - Auto detection ignores node_modules and many vendor/build folders by default. Use @source or source("./dir") to explicitly include desired paths, or check your .gitignore if something is unexpectedly excluded.
- Output duplication when composing multiple CSS entries:
  - Use @reference to share Tailwind configuration details between CSS entries without duplicating emitted utilities.

Examples
1) Vite + React
- vite.config.ts:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```
- src/index.css:
```css
@import "tailwindcss";

/* Customize theme */
@theme {
  --spacing: 0.25rem;
  --color-brand: oklch(0.70 0.20 250);
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```
- src/App.tsx:
```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans grid place-items-center">
      <div className="p-6 rounded-xl bg-gray-900 ring-1 ring-white/10 shadow-lg">
        <h1 className="text-2xl font-medium">Hello Tailwind v4</h1>
        <button className="mt-4 px-4 py-2 rounded-lg bg-brand text-brand-foreground">
          Action
        </button>
      </div>
    </main>
  )
}
```

2) PostCSS with custom plugin options
- postcss.config.js:
```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Use project root as base for scanning
      base: process.cwd(),
      // Let your bundler handle asset URLs
      transformAssetUrls: false,
      // Keep transforms but skip minification
      optimize: { minify: false },
    }),
  ],
}
```
- styles.css:
```css
/* Scope scanning to ./src */
@import "tailwindcss" source("./src");

@theme {
  --spacing: 0.25rem;
  --color-brand: oklch(0.70 0.20 250);
}
```
- Use styles.css as an entry in your bundler (e.g., imported from main.ts).

3) Sharing config across multiple CSS entries
- app.css (main Tailwind entry):
```css
@import "tailwindcss";
@theme {
  --color-brand: oklch(0.70 0.20 250);
}
```
- admin.css (needs the same config, but avoid duplicate utilities):
```css
@reference "./app.css";

/* Admin-specific styles can still use the same theme variables */
.admin-card {
  background: var(--color-brand);
}
```

4) Tuning production optimization
- Vite:
```ts
tailwindcss({
  optimize: { minify: false }, // keep transforms (prefixing, etc.) but readable output
})
```
- PostCSS:
```js
tailwindcss({ optimize: false }) // disable optimization entirely
```

5) Adjusting source detection
- If your sources live in a monorepo or non-standard folder:
```css
@import "tailwindcss" source("../../packages/ui/src");
```
- Or disable automatic detection if your framework/bundler handles it:
```css
@import "tailwindcss" source(none);
```

What’s New (selected highlights from CHANGELOG.md)
- Faster engine with microsecond incremental builds.
- CSS-first: @theme variables, @reference, functional CSS features.
- Automatic content detection with @source and source(...) controls.
- New/expanded utilities: container queries, 3D transforms, gradient APIs, text/drop/inset shadows.
- Variants: not-*, @starting-style, noscript, inverted-colors, pointer-* and others.
- First‑party plugins for Vite and PostCSS; Lightning CSS optimization defaults in production.
- Reworked default theme variables (e.g., --text-*, --leading-*, --font-*, --tracking-*, --ease-*, --container-*).
- Spacing derived from a single --spacing multiplier.

Links
- Documentation: https://tailwindcss.com
- GitHub repository: https://github.com/tailwindlabs/tailwindcss
- Vite plugin README: packages/@tailwindcss-vite/README.md
- PostCSS plugin README: packages/@tailwindcss-postcss/README.md
- Changelog: CHANGELOG.md

Notes
- For advanced/experimental APIs mentioned above (e.g., @custom-variant, functional CSS helpers), refer to the official docs and CHANGELOG.md entries for exact syntax and version behavior.