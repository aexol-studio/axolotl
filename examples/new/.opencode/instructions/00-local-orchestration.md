# Local OpenCode Addendum (Examples/New)

This local instruction set is **additive only**.

- Always read `AGENTS.md` before any planning or implementation.
- Do not duplicate or override global/canonical OpenCode policies.
- Treat canonical policy files as the source of truth for safety, tool use, and memory lifecycle.

## Workstyle for this repository

1. **AGENTS-first**
   - Read `AGENTS.md` at task start.
   - Follow project-specific architecture and constraints from that file.

2. **Parallel planning when context allows**
   - Split work into independent lanes when scopes do not overlap.
   - Typical split: app code lane(s) + infra/config/docs lane(s).
   - Keep ownership explicit per file tree to avoid collisions.

3. **Cross-repo awareness (same ecosystem)**
   - Reuse proven patterns from sibling repositories when compatible.
   - Keep imports/config paths local to this repository (no hidden coupling).

4. **Minimal local config/docs changes**
   - Prefer short, targeted instruction updates.
   - Keep `opencode.jsonc` minimal and valid JSONC.
