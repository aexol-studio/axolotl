# @aexol/axolotl-config — README (from npm)

# @aexol/axolotl-config

Typed project configuration used by Axolotl CLI and examples. Backed by `config-maker`.

## Options (ProjectOptions)

- `schema: string` – path to GraphQL schema
- `models: string` – path to generated models
- `federation?: { schema: string; models: string; }[]` – optional federation parts
- `zeus?: { schema?: string; generationPath: string; }[]` – optional Zeus codegen
- `prompt_info?`, `frontend_prompt_info?`, `graphql_prompt_info?`, `code_prompt_info?` – extra text used by AI tools
- `agent_model?` – model name for AI helpers

See `packages/config/index.ts:1` for the exported `config` and types.

## Environment mapping

The config maker binds env vars for quick setup:

- `SCHEMA_PATH` -> `schema`
- `MODELS_PATH` -> `models`

## Usage

```ts
import { config } from '@aexol/axolotl-config';

const cfg = config.get();
console.log(cfg.schema, cfg.models);
```
