# eslint-config-prettier — README (from repo)

# eslint-config-prettier

Overview
- Purpose: Disable all ESLint rules that are unnecessary or conflict with Prettier, so you can combine your favorite shareable config(s) with Prettier without style-rule fights.
- Scope: Only turns rules off. Use it together with another config that enables rules.
- Works with both eslintrc and the new eslint.config.js (flat config).
- Includes core ESLint rules and selected plugin rules.

Supported plugins (rules are disabled when they conflict with Prettier)
- @babel/eslint-plugin
- @stylistic/eslint-plugin (and its js/ts rule sets)
- @typescript-eslint/eslint-plugin
- eslint-plugin-babel
- eslint-plugin-flowtype
- eslint-plugin-react
- eslint-plugin-standard
- eslint-plugin-unicorn
- eslint-plugin-vue

Note: Since v8, extending just "prettier" is enough. You do not need "prettier/react", "prettier/@typescript-eslint", etc.

Installation
- npm: npm i -D eslint-config-prettier
- yarn: yarn add -D eslint-config-prettier
- pnpm: pnpm add -D eslint-config-prettier
- bun: bun add -D eslint-config-prettier

Quick Start

eslintrc (JSON/YAML/JS)
- Add "prettier" last in extends:
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}

Flat config (eslint.config.js)
import someConfig from "some-other-config-you-use";
// Use the "/flat" entry to get a friendly name in ESLint's config inspector.
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  someConfig,
  eslintConfigPrettier, // put after configs you want to override
];

Find conflicts in your rules
- Run the CLI helper to report rules that are unnecessary or conflict with Prettier:
npx eslint-config-prettier path/to/any-existing-file.js

Using eslint-plugin-prettier?
- Prefer eslint-plugin-prettier’s recommended config, which enables the prettier/prettier rule and turns off a few problematic rules automatically:
{
  "extends": ["plugin:prettier/recommended"]
}

Key Features
- Disables conflicting formatting rules from ESLint core and popular plugins listed above.
- Simple drop-in: extend "prettier" (eslintrc) or include eslint-config-prettier/flat after your other configs (flat config).
- CLI helper: Detects conflicting or redundant rules in your config and suggests cleanup.
- Optional suppression of deprecated/removed rules via env var (ESLINT_CONFIG_PRETTIER_NO_DEPRECATED).
- Flat-config friendly export at "eslint-config-prettier/flat" (includes a name for config inspector).

Configuration

1) Placement and order
- eslintrc: Add "prettier" last in extends. It cannot override your own "rules" section—use the CLI helper to remove conflicts from "rules".
- Flat config: Put eslint-config-prettier after configs you want to override.

2) Flat config plugin naming caveat
- In flat config, the plugin key you choose determines rule names. eslint-config-prettier disables rules by their official names (e.g., @typescript-eslint/indent). If you alias the plugin (e.g., plugins: { ts: typescriptEslint }), eslint-config-prettier cannot recognize ts/indent.
- Use official plugin names to avoid missing exclusions.

3) Exclude deprecated/removed rules
- Set env var to skip turning off deprecated/removed rules:
ESLINT_CONFIG_PRETTIER_NO_DEPRECATED=1 npx eslint-find-rules --deprecated index.js

4) CLI helper behavior and modes
- Usage: npx eslint-config-prettier <one-or-more-existing-files>
- Exit codes: 0 = no problems; 1 = unexpected error; 2 = conflicting rules found.
- Multiple files (helpful with overrides/multiple configs):
npx eslint-config-prettier src/index.js test/index.test.js legacy/main.js
- Control which config system the CLI uses:
  - ESLINT_USE_FLAT_CONFIG=true → only flat config
  - ESLINT_USE_FLAT_CONFIG=false → only eslintrc
  - Unset/other → tries flat config first, then eslintrc
- Warning: For flat config, the CLI imports eslint/use-at-your-own-risk (may change).

Common Pitfalls
- Not placing "prettier" last: Rules from other configs may still win.
- Expecting "prettier" to override your eslintrc "rules": ESLint allows your rules to override extends; use the CLI and remove conflicting rules.
- Aliasing plugins in flat config: Disables won’t match; stick to official plugin names (@typescript-eslint, etc.).
- Extending legacy entries like "prettier/react": Since v8, you only need "prettier".
- Enabling special rules without compatible options (see below).
- Using eslint-plugin-prettier with --fix alongside arrow-body-style/prefer-arrow-callback may lead to fix loops—use plugin:prettier/recommended or disable those rules.

Special Rules (enable with caution or specific options)
- arrow-body-style, prefer-arrow-callback: Can conflict with eslint-plugin-prettier when auto-fixing. Solution: extend plugin:prettier/recommended or disable manually.
- curly: Avoid "multi-line" or "multi-or-nest" options; use "all" to stay compatible.
- lines-around-comment (deprecated): If enabled, allow comments at block/object/array start/end (allowBlockStart/End, allowObjectStart/End, allowArrayStart/End).
- max-len (deprecated): Keep in sync with Prettier’s printWidth. Prettier can’t split long strings/regex/comments—manual intervention needed.
- no-confusing-arrow (deprecated): Use ["error", { "allowParens": false }] to avoid conflicts.
- no-mixed-operators (deprecated): Splitting expressions or adding variables may be needed; Prettier removes many “unnecessary” parens.
- no-tabs (deprecated): Use ["error", { "allowIndentationTabs": true }] so it works with either spaces or tabs per Prettier.
- no-unexpected-multiline: May require occasional refactors or temporary disables; run ESLint before Prettier to catch issues.
- quotes (and @stylistic/@typescript-eslint variants):
  - Enforce backticks: ["error", "backtick"].
  - Forbid unnecessary backticks: match ESLint rule with Prettier singleQuote option; use { "avoidEscape": true, "allowTemplateLiterals": false } (or "never" for @stylistic).
- unicorn/template-indent: Configure to avoid tags handled by Prettier (e.g., limit to outdent/dedent/sql/styled; exclude html/gql/md cases).
- vue/html-self-closing: Set { html: { void: "any" } } to match Prettier’s formatting of void HTML elements.

Other rules worth mentioning
- no-sequences: Prettier adds parentheses that hide accidental comma operators. Consider banning SequenceExpression via no-restricted-syntax for stronger protection:
{
  "rules": {
    "no-restricted-syntax": ["error", "SequenceExpression"]
  }
}

Examples

1) eslintrc with eslint-config-prettier
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ]
}

2) Flat config with eslint-config-prettier/flat
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier
];

3) Running the CLI helper
# Single file
npx eslint-config-prettier src/index.ts

# Multiple files (useful with overrides)
npx eslint-config-prettier src/index.ts test/index.test.ts

# Force eslintrc or flat config
ESLINT_USE_FLAT_CONFIG=false npx eslint-config-prettier src/index.ts
ESLINT_USE_FLAT_CONFIG=true npx eslint-config-prettier src/index.ts

4) Curly rule compatible with Prettier
{
  "rules": {
    "curly": ["error", "all"]
  }
}

5) Quotes aligned with Prettier

Double quotes example:
- ESLint:
{
  "rules": {
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }]
  }
}
- Prettier (default):
{ "singleQuote": false }

Single quotes example:
- ESLint:
{
  "rules": {
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": false }]
  }
}
- Prettier:
{ "singleQuote": true }

6) no-tabs compatible with Prettier
{
  "rules": {
    "no-tabs": ["error", { "allowIndentationTabs": true }]
  }
}

7) vue/html-self-closing compatible
{
  "rules": {
    "vue/html-self-closing": ["error", { "html": { "void": "any" } }]
  }
}

8) unicorn/template-indent limited to non-Prettier tags
{
  "rules": {
    "unicorn/template-indent": [
      "error",
      {
        "tags": ["outdent", "dedent", "sql", "styled"],
        "functions": ["dedent", "stripIndent"],
        "selectors": [],
        "comments": ["indent"]
      }
    ]
  }
}

9) Strongly forbid comma operator
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      { "selector": "SequenceExpression", "message": "The comma operator is confusing. Don’t use it!" }
    ]
  }
}

FAQs

- Do I still need "prettier/react" or "prettier/@typescript-eslint"? No. Since v8 you only extend "prettier".
- Why does a conflicting rule in "rules" still fire in eslintrc? ESLint lets your local rules override extends. Remove conflicting rules; use the CLI to find them.
- Why didn’t eslint-config-prettier disable my ts/indent rule in flat config? You aliased the plugin (e.g., "ts"); eslint-config-prettier disables "@typescript-eslint/indent". Use official plugin names.
- Can I omit deprecated rules from being disabled? Yes, set ESLINT_CONFIG_PRETTIER_NO_DEPRECATED to any non-empty value.
- What are the CLI exit codes? 0 = ok, 1 = unexpected error, 2 = conflicts found.

Links
- Repo and README: https://github.com/prettier/eslint-config-prettier
- Prettier: https://github.com/prettier/prettier
- ESLint eslintrc docs: https://eslint.org/docs/latest/use/configure/configuration-files
- ESLint flat config docs: https://eslint.org/docs/latest/use/configure/configuration-files-new
- eslint-plugin-prettier recommended config: https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
- Special rules details and examples: See README sections in the repo (e.g., curly, quotes, no-unexpected-multiline, unicorn/template-indent, vue/html-self-closing).