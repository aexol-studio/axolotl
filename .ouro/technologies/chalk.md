# chalk — README (from repo)

# Chalk

Terminal string styling done right.

Chalk is a fast, dependency-free library for styling terminal strings with a clean, chainable API. It auto-detects color support, handles 16-color, 256-color, and Truecolor (16M) output, and is used across a large portion of the JavaScript ecosystem.

## Installation

- Node.js project:
  - npm: `npm install chalk`
- Important: Chalk 5 is ESM-only. If you need CommonJS (`require`), TypeScript without ESM, or certain build tools, consider using `chalk@4` for now. See the Chalk 5 release notes for details: https://github.com/chalk/chalk/releases/tag/v5.0.0

## Quick Start

```js
import chalk from 'chalk';

console.log(chalk.blue('Hello world!'));
```

## Key Features

- Expressive, chainable API (e.g., `chalk.red.bold('Error')`)
- High performance, no dependencies
- Nested styles and safe composition
- 16-color, 256-color, and Truecolor support with automatic downsampling
- Auto-detects terminal color support
- ESM, does not extend String.prototype
- Mature, stable, and actively maintained

## API and Configuration

- Chain styles and call with your strings:
  - Example: `chalk.red.bold.underline('Hello', 'world')`
  - Order doesn’t matter; later styles override earlier ones (`chalk.red.yellow.green` is equivalent to `chalk.green`).
  - Multiple arguments are joined with spaces.

- Color level
  - `chalk.level` indicates detected color support (0–3).
    - 0: No color, 1: Basic (16), 2: 256-color, 3: Truecolor.
  - Override globally (not recommended for libraries): `chalk.level = 1`
  - Per-instance override (recommended for libraries):
    ```js
    import {Chalk} from 'chalk';
    const customChalk = new Chalk({level: 0}); // Disable colors for this instance
    ```

- Detect color support
  - `supportsColor`: Terminal color capability info for stdout.
  - Use flags or env to force behavior:
    - CLI flags: `--color`, `--no-color`, `--color=256`, `--color=16m`
    - Env var: `FORCE_COLOR=0|1|2|3` (overrides other detection)
  - Stderr variants:
    - `chalkStderr`: Chalk instance configured for stderr.
    - `supportsColorStderr`: Color support info for stderr.

- Convenience: style name lists
  - `modifierNames`, `foregroundColorNames`, `backgroundColorNames`, `colorNames`
  - Useful for validation and dynamic styling.

Example:

```js
import chalk, {
  Chalk,
  supportsColor,
  chalkStderr,
  supportsColorStderr,
  modifierNames,
  foregroundColorNames,
} from 'chalk';

if (supportsColor) {
  console.log(chalk.green('Colors supported!'));
}

if (supportsColorStderr) {
  console.error(chalkStderr.red('Error to stderr with correct colors'));
}

console.log(modifierNames.includes('bold')); // true
console.log(foregroundColorNames.includes('pink')); // false

const noColor = new Chalk({level: 0});
console.log(noColor.red('This will print without color'));
```

## Styles

- Modifiers:
  - reset, bold, dim, italic, underline, overline, inverse, hidden, strikethrough, visible
  - Note: Some (italic, underline, overline, strikethrough) are not widely supported in all terminals.

- Colors:
  - black, red, green, yellow, blue, magenta, cyan, white
  - blackBright (aliases: gray, grey), redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright

- Background colors:
  - bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite
  - bgBlackBright (aliases: bgGray, bgGrey), bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright

Use them in chains:

```js
console.log(chalk.blue.bgRed.bold('Hello world!'));
console.log(chalk.green(
  'I am green ' +
  chalk.blue.underline.bold('with a blue substring') +
  ' that becomes green again'
));
```

## 256 and Truecolor

Chalk supports 256-color and Truecolor output on capable terminals and will downsample colors automatically based on detected support level (or per-instance `level`).

Color models and examples:
- RGB: `chalk.rgb(123, 45, 67).underline('Underlined reddish color')`
- Hex: `chalk.hex('#DEADED').bold('Bold gray!')`
- ANSI 256: `chalk.bgAnsi256(194)('Honeydew-ish background')`

Background variants are prefixed with `bg` (e.g., `bgHex`, `bgRgb`, `bgAnsi256`).

## Platform Notes

- Browser: Modern Chrome (since 69) supports ANSI escape codes in the DevTools console.
- Windows: Prefer Windows Terminal over cmd.exe for correct and rich color support.

## Common Pitfalls

- ESM-only in Chalk 5:
  - Use `import` instead of `require`. If you cannot switch, use `chalk@4`.
  - Some build tools/TypeScript setups may require additional ESM config. See the Chalk 5 release notes.

- Terminal support varies:
  - Not all terminals support all modifiers; underlines/italics/overlines/strikethrough may not render everywhere.
  - Piped output or CI may have reduced or disabled color support. Force with `--color` or `FORCE_COLOR=1|2|3`.

- Global overrides:
  - Changing `chalk.level` affects all consumers in the same process. For reusable modules, create a new `Chalk` instance instead.

- Style precedence:
  - Later chained styles override earlier ones. Plan chains accordingly to avoid unexpected colors.

## Examples

- Combine styled and plain strings:

```js
import chalk from 'chalk';

console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));
console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar')); // args joined by spaces
```

- Template literals:

```js
import chalk from 'chalk';

console.log(`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);
```

- Custom “theme” helpers:

```js
import chalk from 'chalk';

const error = chalk.bold.red;
const warning = chalk.hex('#FFA500'); // Orange

console.log(error('Error!'));
console.log(warning('Warning!'));
```

- Force color in CI or when piping:

```sh
# CLI flags
node app.js --color=16m
node app.js --no-color

# Env var (overrides all checks)
FORCE_COLOR=3 node app.js
```

- Validate style names:

```js
import {modifierNames, foregroundColorNames} from 'chalk';

function isValidStyle(name) {
  return modifierNames.includes(name) || foregroundColorNames.includes(name);
}
```

## Links

- Repo and docs: https://github.com/chalk/chalk
- Chalk 5 (ESM) release notes: https://github.com/chalk/chalk/releases/tag/v5.0.0
- Related:
  - chalk-template (tagged template literals): https://github.com/chalk/chalk-template
  - chalk-cli: https://github.com/chalk/chalk-cli
  - supports-color (detection): https://github.com/chalk/supports-color
  - ansi-styles (escape codes): https://github.com/chalk/ansi-styles
  - strip-ansi: https://github.com/chalk/strip-ansi
  - wrap-ansi: https://github.com/chalk/wrap-ansi
  - slice-ansi: https://github.com/chalk/slice-ansi