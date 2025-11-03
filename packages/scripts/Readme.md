# @aexol/axolotl-scripts

Internal maintenance scripts for the monorepo. The current tool synchronizes package versions across workspaces and updates internal dependency ranges to the root version.

## What’s here

- `src/packages.ts` – bumps each package.json version to the root version and rewrites internal deps to `^<rootVersion>` for packages found in `packages/`, `adapters/`, and `examples/`.

## Run

```
cd packages/scripts
node lib/packages.js
```

Note: build first if needed: `npm run build --ws --if-present`.
