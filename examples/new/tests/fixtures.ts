import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage, DashboardPage, SettingsPage } from './page-objects';

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
 * Safe page load helper that avoids networkidle hanging issues in Firefox/WebKit.
 * Uses domcontentloaded with a small buffer for React hydration instead of networkidle.
 *
 * @param page - The Playwright Page instance
 * @param options - Optional timeout override
 */
export const waitForPageReady = async (page: Page, options?: { timeout?: number }) => {
  const timeout = options?.timeout ?? 30_000;
  try {
    // Use domcontentloaded — it's more reliable than networkidle on Firefox/WebKit
    await page.waitForLoadState('domcontentloaded', { timeout });
    // Small buffer for React hydration
    await page.waitForTimeout(300);
  } catch {
    // If that fails, just continue — the page might be ready enough
  }
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
});

export { expect };
