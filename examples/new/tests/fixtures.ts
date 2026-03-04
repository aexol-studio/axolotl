import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage, DashboardPage, SettingsPage, NotesPage } from './page-objects';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Storage State Paths (must match playwright.config.ts)
// ============================================================================

/** Path to the authenticated user's storage state file */
export const USER_AUTH_FILE = path.join(__dirname, '..', '.playwright', 'user-auth.json');

// ============================================================================
// Page Ready Helper
// ============================================================================

/**
 * Deterministic page readiness helper.
 *
 * Waits for DOM content to load and for the document readiness state to move
 * past the initial "loading" phase. This avoids fixed sleeps while still
 * providing a stable baseline before page-specific assertions.
 *
 * @param page - The Playwright Page instance
 */
export const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.readyState === 'interactive' || document.readyState === 'complete');
};

// ============================================================================
// Custom Test Fixtures
// ============================================================================

/**
 * Fixture type definitions for typed page objects.
 * Extends Playwright's base test with project-specific page objects.
 */
interface TestFixtures {
  /** LoginPage page object — pre-constructed with the current page */
  loginPage: LoginPage;
  /** DashboardPage page object — pre-constructed with the current page */
  dashboardPage: DashboardPage;
  /** SettingsPage page object — pre-constructed with the current page */
  settingsPage: SettingsPage;
  /** NotesPage page object — pre-constructed with the current page */
  notesPage: NotesPage;
}

/**
 * Custom test fixture extending Playwright's base test with:
 * - Typed page objects (loginPage, dashboardPage, settingsPage)
 *
 * Usage:
 * ```typescript
 * import { test, expect } from '../fixtures';
 *
 * test('can login', async ({ loginPage }) => {
 *   await loginPage.goto();
 *   await loginPage.login('user@example.com', 'password');
 * });
 * ```
 *
 * For unauthenticated tests: use default `page` fixture
 * For authenticated tests: run with --project=chromium-auth (uses storageState from auth.setup.ts)
 */
export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  notesPage: async ({ page }, use) => {
    await use(new NotesPage(page));
  },
});

export { expect };
