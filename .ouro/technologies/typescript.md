# typescript — README (from repo)

# TypeScript

Overview
TypeScript is a typed superset of JavaScript for building large-scale applications. It adds optional static types and modern language features, then compiles to standards-based, readable JavaScript for any runtime (browser, Node.js, Deno, edge, etc.). Try features instantly in the online playground.

Installation
- Latest stable:
  - npm: npm install -D typescript
  - pnpm: pnpm add -D typescript
  - yarn: yarn add -D typescript
- Nightly builds (cuts of main): npm install -D typescript@next
- Check your installed version: npx tsc --v

Quick Start
1) Init a project and install:
   - npm init -y
   - npm install -D typescript

2) Create a tsconfig.json:
   - npx tsc --init
   - Or use a minimal config:
     {
       "compilerOptions": {
         "strict": true
       },
       "include": ["src"]
     }

3) Add code (src/index.ts):
   interface User {
     id: number;
     name: string;
   }

   function greet(user: User) {
     return `Hello, ${user.name}!`;
   }

   console.log(greet({ id: 1, name: "Ada" }));

4) Compile:
   - npx tsc
   - Output goes to ./ (or ./dist if you set outDir). Run with node accordingly.

5) Optional: watch mode for quick feedback:
   - npx tsc --watch

Key Features
- Gradual typing for JavaScript: Start with plain JS and add types where they help most.
- Modern JavaScript emit: Write new syntax; compile to target runtimes’ capabilities.
- Language Service: IDE features like completions, quick info, auto-imports, refactors, and formatting (via the TypeScript server used by editors). The formatter is internal and accessed through the language service rather than a public API (see src/services/formatting/README.md).
- First-class library typings:
  - ECMAScript language features (ECMA-262)
  - DOM APIs for browsers
  - Intl APIs (ECMA-402)
  - See src/lib/README.md for how built-in lib declarations are maintained. DOM files ending with .generated.d.ts are auto-generated; contribute via the TypeScript DOM lib generator rather than editing them directly.
- Standards alignment: New JS/Intl features are added once sufficiently stable (e.g., JS Stage 3). See src/lib/README.md and the linked TC39 proposal lists.
- Cross-platform CLI (tsc) and project config (tsconfig.json).

Configuration
- tsconfig.json: Central place to configure the compiler and project layout.
  - Create with npx tsc --init (generates a commented template).
  - Common fields you’ll likely use:
    - compilerOptions.strict: Enable all strict type-checking options (recommended).
    - include/exclude: Control which files are part of the project.
    - outDir/rootDir: Control output and source roots.
  - Note on libraries:
    - TypeScript ships declaration files for ECMAScript, DOM, and Intl in src/lib.
    - You can choose which libraries are available at compile-time with the tsconfig lib option (see official docs). DOM and Web Worker types depend on these libs; the DOM files with .generated.d.ts are auto-generated.

- Formatting:
  - Formatting is performed via the language service. There is no public standalone formatter API; editors and the tsserver use internal rules (see src/services/formatting/README.md).

Common Pitfalls and Notes
- Narrowing and callbacks (intentional behavior; see .github/ISSUE_TEMPLATE/types-not-correct-in-with-callback.md):
  - Narrowings are not respected in callbacks because values may have changed by the time a callback runs.
    function fn(obj: { name: string | number }) {
      if (typeof obj.name === "string") {
        // Errors (narrowing not preserved inside async callback)
        window.setTimeout(() => console.log(obj.name.toLowerCase()));
      }
    }
  - Function calls do not reset narrowings, even if they could mutate objects:
    function fn(obj: { name: string | number }) {
      if (typeof obj.name === "string") {
        mut();
        // Still allowed; TypeScript doesn’t assume mutation unless it sees it
        console.log(obj.name.toLowerCase());
      }

      function mut() {
        obj.name = 42;
      }
    }

- Editing DOM/lib files:
  - Don’t hand-edit .generated.d.ts files in src/lib (e.g., dom.generated.d.ts). Submit changes to the TypeScript-DOM-lib-generator.

- Formatting expectations:
  - If you’re trying to format code programmatically, use your IDE/editor integrations. The formatter is internal to the language service.

Examples
- Compile a single file
  - hello.ts:
    export const hello = (name: string) => `Hello, ${name}!`;
    console.log(hello("TypeScript"));
  - npx tsc hello.ts
  - node hello.js

- Basic project with outDir
  - tsconfig.json:
    {
      "compilerOptions": {
        "strict": true,
        "outDir": "dist",
        "rootDir": "src"
      },
      "include": ["src"]
    }
  - src/main.ts:
    type ID = number & { readonly brand: unique symbol };

    function asId(n: number): ID {
      return n as ID;
    }

    function getLabel(id: ID) {
      return `ID-${id}`;
    }

    const id = asId(123);
    console.log(getLabel(id));
  - Commands:
    - npx tsc
    - node dist/main.js

- Watch mode for fast feedback
  - npx tsc --watch
  - Edit files; TypeScript recompiles and reports type errors incrementally.

- Trying new features
  - Install nightly: npm install -D typescript@next
  - Use in your project: npx tsc --v should reflect the nightly version.

Contributing (brief)
- See CONTRIBUTING.md for full details.
  - Build locally: npm ci; npx hereby local
  - Run tests: npx hereby runtests-parallel
  - Lint/format before finishing: npx hereby lint; npx hereby format
- Library declaration contributions:
  - Edit src/lib except for generated files; DOM/Web Worker typings are generated upstream (see src/lib/README.md).

Links
- Homepage: https://www.typescriptlang.org/
- Playground: https://www.typescriptlang.org/play/
- Docs: 
  - TypeScript in 5 minutes: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
  - Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Community:
  - Stack Overflow: https://stackoverflow.com/questions/tagged/typescript
  - Discord: https://discord.gg/typescript
- Repository: https://github.com/microsoft/TypeScript
- Roadmap: https://github.com/microsoft/TypeScript/wiki/Roadmap
- Blog: https://blogs.msdn.microsoft.com/typescript (historical)