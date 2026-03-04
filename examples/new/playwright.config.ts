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
const LOCAL_PORT = process.env.PORT || '8080';
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;
const baseURL = E2E_URL || LOCAL_URL;
const isLocalDev = !E2E_URL;
const isCI = !!process.env.CI;

/**
 * E2E must always use local email artifacts (/temp/emails).
 */
process.env.EMAIL_MODE = 'local';

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
  globalTeardown: './tests/global-teardown.ts',

  /*
   * Always-parallel policy (local + CI):
   * keep full parallelism enabled and rely on test isolation patterns
   * (unique test data + explicit empty storageState contexts where needed)
   * instead of globally reducing workers.
   */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,

  /* Retry on CI only */
  retries: isCI ? 2 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI ? 'dot' : 'html',

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
          env: {
            ...(process.env as Record<string, string>),
            EMAIL_MODE: 'local',
          },
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
});
