import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determine base URL:
 * - Use E2E_URL environment variable if provided (for staging/production testing)
 * - Fall back to local dev server at http://localhost:8080
 */
const E2E_URL = process.env.E2E_URL;
const LOCAL_URL = 'http://localhost:8080';
const baseURL = E2E_URL || LOCAL_URL;
const isLocalDev = !E2E_URL;

/**
 * Storage state file path for authenticated sessions
 */
const USER_AUTH_FILE = path.join(__dirname, '.playwright', 'user-auth.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',

  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'dot' : 'html',

  /* Global timeout for each test */
  timeout: 60_000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace on failure for debugging */
    trace: 'retain-on-failure',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for setup and test execution */
  projects: [
    // ===== Setup project (run once to create auth state) =====
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './tests',
      use: { ...devices['Desktop Chrome'] },
    },

    // ===== Default chromium project (no auth required) =====
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /auth\//,
      testIgnore: /auth\.setup\.ts/,
    },

    // Optional cross-browser testing (set ALL_BROWSERS=true)
    ...(process.env.ALL_BROWSERS
      ? [
          {
            name: 'firefox' as const,
            use: { ...devices['Desktop Firefox'] },
            testIgnore: [/auth\.setup\.ts/],
          },
          {
            name: 'webkit' as const,
            use: { ...devices['Desktop Safari'] },
            testIgnore: [/auth\.setup\.ts/],
          },
        ]
      : []),

    // ===== Authenticated project (uses saved auth state) =====
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: USER_AUTH_FILE,
      },
      dependencies: ['setup'],
      testIgnore: [/auth\.setup\.ts/, /auth\//],
    },
  ],

  /* Run your local dev server before starting the tests (only when E2E_URL is not provided) */
  ...(isLocalDev
    ? {
        webServer: {
          command: 'npm run dev',
          url: LOCAL_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
});
