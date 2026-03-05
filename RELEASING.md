# Releasing Axolotl (npm workspaces)

This repo publishes packages via GitHub Actions when a git tag like `2.2.1` is pushed.

- Trigger: `.github/workflows/release.yml` on `push.tags: [0-9]+.[0-9]+.[0-9]+`
- Publish command in CI: `npm publish -ws --access public --tag latest`

## 1) Start from a clean `main`

```bash
git checkout main
git pull origin main
git status
```

If `git status` is not clean, commit or stash first.

## 2) Choose the next version

Example patch bump from `2.2.1` to `2.2.2`:

```bash
VERSION=2.2.2
npm version "$VERSION" --no-git-tag-version
```

This updates only the root `package.json` version.

## 3) Sync all workspace package versions

```bash
npx tsx packages/scripts/src/packages.ts
```

This script propagates the root version to package manifests in `packages/`, `adapters/`, and `examples/`, and updates internal dependency ranges.

## 4) Regenerate lockfile and validate

```bash
npm i
npm run build --ws --if-present
npm test
```

## 5) Commit release changes

```bash
git add .
git commit -m "release: $VERSION"
```

## 6) Create and push the release tag

Use a plain SemVer tag (no `v` prefix):

```bash
git tag "$VERSION"
git push origin main
git push origin "$VERSION"
```

## 7) Verify CI publish

Check the GitHub Release workflow run:

```bash
gh run list --workflow release.yml -L 5
```

Optional npm checks:

```bash
npm view @aexol/axolotl version
npm view @aexol/axolotl-core version
npm view @aexol/axolotl-config version
npm view @aexol/axolotl-graphql-yoga version
```

## Notes

- For official releases, do not rely on `npm run sync` as the only step; it does not create/push the release tag.
- The tag push is what triggers publishing.
