# playwright — README (from repo)

# Playwright

Overview
Playwright is an end-to-end web testing and automation framework for Chromium, Firefox and WebKit. It provides a single, cross-browser API with built-in auto-waiting, resilient web-first assertions, browser isolation via contexts, and powerful tooling like tracing, code generation and an inspector.

- Browsers: Chromium, Firefox, WebKit (headless and headed, Linux/macOS/Windows)
- Languages: TypeScript/JavaScript, plus official client libraries for Python, .NET, and Java
- Use cases: UI testing, API testing, mobile emulation, network mocking, accessibility checks, tracing

Installation
- Easiest: bootstrap a project
  - npm init playwright@latest
- Manual (JS/TS runner)
  - npm i -D @playwright/test
  - npx playwright install

Quick Start
Minimal Playwright Test in TypeScript/JavaScript:

```ts
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

Run:
- npx playwright test
- View HTML report: npx playwright show-report

Key Features
- Auto-waiting and actionability checks
  - Playwright waits for elements to be visible, stable and ready to receive events before acting. See Auto-waiting (docs/src/actionability.md).
- Web-first assertions
  - expect(page.locator(...)).toHaveText(...), toBeVisible(), toHaveURL(), and more. Assertions auto-retry until conditions are met.
- Multiple browsers and devices
  - Launch Chromium/Firefox/WebKit; emulate devices via playwright.devices; geolocation/locale/timezone.
- Full isolation and speed
  - BrowserContext per test with a fresh profile; re-use auth state efficiently.
- Powerful tooling
  - Codegen (record tests), Inspector (debug interactively), Trace Viewer (time-travel debugging with DOM snapshots, screenshots, network/console).
- Robust network control
  - Route/fulfill/abort requests; record/replay HARs; API testing helpers share cookies with the browser.
- Accessibility & snapshots
  - Accessibility testing via axe-core integrations (see docs/src/accessibility-testing-js.md). ARIA snapshot testing (docs/src/aria-snapshots.md).
- Experimental Component Testing
  - @playwright/ct-* packages (React/Vue/Svelte) are experimental and do not follow semver (see packages/playwright-ct-* READMEs).

Configuration
Minimal test config (TypeScript) with API testing defaults (from docs/src/api-testing-js.md):

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // API base URL + headers for request fixture
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
    // Proxy example (if needed):
    // proxy: { server: 'http://my-proxy:8080', username: 'user', password: 'secret' },
  },
});
```

Handy per-context options (see docs/src/api/class-browsercontext.md and docs/src/api/params.md):
- viewport, deviceScaleFactor, userAgent, geolocation, locale, timezoneId
- storageState for reusing auth (file or object)
- recordVideo/recordHar/tracing
- extraHTTPHeaders, httpCredentials, ignoreHTTPSErrors, proxy
- serviceWorkers: 'block' to disable them when routing

Common Pitfalls and How to Avoid Them
- Prefer Locator over ElementHandle
  - Use page.locator(...) and Locator APIs. ElementHandle is discouraged and racy (docs/src/api/class-elementhandle.md).
- Don’t use fixed timeouts
  - Avoid waitForTimeout; rely on auto-waiting and web-first assertions (docs/src/api/class-locator.md#locator-waitfor).
- Request interception vs Service Workers
  - context.route/page.route will not intercept requests handled by Service Worker (docs/src/api/class-browsercontext.md, routeFromHAR note). Consider blocking service workers via serviceWorkers: 'block'.
- Mobile tap and hasTouch
  - page.tap requires hasTouch enabled in the context (docs/src/api/class-elementhandle.md#elementhandle-tap).
- Deprecated/less-ideal APIs
  - waitForNavigation: prefer waitForURL and web assertions.
  - ‘noWaitAfter’ options are deprecated/ignored in many places.
- API auth & cookies
  - context.request shares storage with the browser context; global request.newContext is isolated (docs/src/api-testing-js.md “Context request vs global request”).
- Route ordering
  - When multiple routes match, the last registered runs first. Use route.fallback() vs route.continue() to control chaining (docs/src/api/class-route.md#route-fallback).

Examples

1) Page screenshot (from README)
```ts
import { test } from '@playwright/test';

test('Page Screenshot', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: 'example.png' });
});
```

2) Mobile emulation and geolocation (from README)
```ts
import { test, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13 Pro'],
  locale: 'en-US',
  geolocation: { longitude: 12.492507, latitude: 41.889938 },
  permissions: ['geolocation'],
});

test('Mobile and geolocation', async ({ page }) => {
  await page.goto('https://maps.google.com');
  await page.getByText('Your location').click();
  await page.waitForRequest(/.*preview\/pwa/);
  await page.screenshot({ path: 'colosseum-iphone.png' });
});
```

3) Evaluate in browser context (from README)
```ts
import { test } from '@playwright/test';

test('Evaluate in browser context', async ({ page }) => {
  await page.goto('https://www.example.com/');
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    deviceScaleFactor: window.devicePixelRatio
  }));
  console.log(dimensions);
});
```

4) Intercept network requests (from README)
```ts
import { test } from '@playwright/test';

test('Intercept network requests', async ({ page }) => {
  await page.route('**', route => {
    console.log(route.request().url());
    route.continue();
  });
  await page.goto('http://todomvc.com');
});
```

5) API testing (from docs/src/api-testing-js.md)
- Configure in playwright.config.ts (see Configuration)
- Write tests:

```ts
import { test, expect } from '@playwright/test';

const REPO = 'test-repo-1';
const USER = 'github-username';

test('should create a bug report', async ({ request }) => {
  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
    data: { title: '[Bug] report 1', body: 'Bug description' }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(
    expect.objectContaining({ title: '[Bug] report 1', body: 'Bug description' })
  );
});
```

Optional setup/teardown (same source): create/delete repo in test.beforeAll/test.afterAll.

6) Reuse auth state between API and browser (from docs/src/api-testing-js.md)
```ts
import { request } from '@playwright/test';

const requestContext = await request.newContext({
  httpCredentials: { username: 'user', password: 'passwd' }
});
await requestContext.get('https://api.example.com/login');
await requestContext.storageState({ path: 'state.json' });

const context = await browser.newContext({ storageState: 'state.json' });
```

7) ARIA Snapshots (from docs/src/aria-snapshots.md)
```ts
import { test, expect } from '@playwright/test';

test('banner aria snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - banner:
      - heading /Playwright enables reliable end-to-end/ [level=1]
      - link "Get started"
  `);
});
```

Core Concepts and APIs (links point to discovered docs)
- Auto-waiting and assertions: docs/src/actionability.md, docs/src/api/class-locator.md, docs/src/api/class-locatorassertions.md, docs/src/api/class-pageassertions.md
- Browser/Context/Page lifecycle: docs/src/api/class-browsertype.md, docs/src/api/class-browser.md, docs/src/api/class-browsercontext.md, docs/src/api/class-page.md
- Network: docs/src/api/class-route.md, docs/src/api/class-request.md, docs/src/api/class-response.md; HAR/routeFromHAR in BrowserContext
- API testing: docs/src/api-testing-js.md (+ csharp/java/python variants)
- Tracing: docs/src/api/class-tracing.md
- Device emulation: viewport/geolocation/locale/timezone (context options); devices catalog via playwright.devices (docs/src/api/class-playwright.md)
- Accessibility: docs/src/accessibility-testing-js.md (Axe integration)
- Clock/time control: docs/src/api/class-clock.md

Workflow Tips
- Record tests quickly:
  - npx playwright codegen <url>  (then refine to use locators + assertions)
- Debugging:
  - Run headed, use Playwright Inspector; set PWDEBUG=1
  - Enable tracing: in test config or via context.tracing.start/stop; view with npx playwright show-trace trace.zip
- Linux dependencies:
  - On first install, Playwright downloads browser binaries. On CI or minimal containers, ensure system dependencies for browsers are present; see system requirements on playwright.dev/docs/intro#system-requirements.

FAQ-style Notes
- “It waits forever” — assertions and actions auto-wait up to a timeout. Prefer expect(...) to explicit waits; verify selectors are correct (use text, roles, and test IDs).
- Interception not working — if a Service Worker controls the page, it may bypass route handlers; set serviceWorkers: 'block' or disable SW in app for tests.
- Taps not working — enable hasTouch in the context for touch interactions.
- Prefer .getByRole, .getByText, .getByTestId — these locators are resilient and readable.

Links
- Documentation: https://playwright.dev
- API reference: https://playwright.dev/docs/api/class-playwright
- Repository: https://github.com/microsoft/playwright
- System requirements: https://playwright.dev/docs/intro#system-requirements
- Discord: https://aka.ms/playwright/discord

Appendix: Selected API References (from collected docs)

Locators and Assertions
- Use page.locator(selector) and chains (frameLocator, filter, first/last/nth).
- Assertions (auto-retrying):
  - Locator: toBeVisible/Hidden/Enabled/Disabled/Checked/Editable/Empty/InViewport, toHaveText/Value/Values/Attribute/Class/Count/CSS/Id/Role, toMatchAriaSnapshot, toContainText/Class
  - Page: toHaveURL, toHaveTitle
- Prefer getByRole/getByLabel/getByPlaceholder/getByText/getByTestId for accessibility-friendly selectors.

Routing (Network)
- context.route(url, handler) — intercept/abort/fulfill/continue/fallback
- context.routeFromHAR(path, { update, notFound, url, updateMode, updateContent })
- route.fetch/fulfill/continue/fallback — modify flow
- Note: Service Workers can bypass interception.

API Testing Helpers
- request fixture (in @playwright/test) picks up use.baseURL/extraHTTPHeaders.
- playwright.request.newContext(...) for isolated API contexts.
- Share cookies between BrowserContext and request via context.request; use APIRequest.newContext for isolation.

Tracing
- context.tracing.start({ screenshots, snapshots, sources, title })
- context.tracing.stop({ path }) and show with npx playwright show-trace

Device & Media Emulation
- Context options: viewport, deviceScaleFactor, isMobile, hasTouch, userAgent
- page.emulateMedia({ media, colorScheme, reducedMotion, forcedColors, contrast })

Accessibility Testing (Axe)
- JS: @axe-core/playwright with AxeBuilder({ page }).analyze() and expect(violations).toEqual([])

This page compiles the most relevant pieces from repository docs: README.md, docs/src/* (API and guides), and package READMEs for component testing and browser flavors.