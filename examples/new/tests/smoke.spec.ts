/**
 * Smoke Tests — basic app health checks.
 *
 * Consolidated smoke tests that verify essential app structure in minimal navigations.
 *
 * Unauthenticated block (storageState override clears cookies):
 *   - Landing page structure (hero, CTAs, header, main)
 *   - Login page structure (heading, toggle, fields, submit)
 *   - Protected route redirects (/app → /login, /settings → /login)
 *
 * Authenticated block (uses chromium-auth storageState):
 *   - Dashboard structure, nav bar, avatar dropdown, settings navigation
 */

import { test, expect } from './fixtures';
import type { Locator, Page } from '@playwright/test';
import { ROUTES } from './helpers';

const ensureAuthenticatedTopNav = async (params: { userMenuTrigger: Locator; myTodosLink: Locator; page: Page }) => {
  const { userMenuTrigger, myTodosLink, page } = params;
  const hasAuthenticatedNav = await userMenuTrigger.isVisible().catch(() => false);

  if (hasAuthenticatedNav) {
    return;
  }

  await page.reload();
  await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 15_000 });
  await expect(myTodosLink).toBeVisible({ timeout: 10_000 });
  await expect(userMenuTrigger).toBeVisible({ timeout: 10_000 });
};

// ============================================================================
// Unauthenticated Smoke Tests
// ============================================================================

test.describe('Unauthenticated smoke tests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('landing page loads with hero and navigation', async ({ page }) => {
    await page.goto(ROUTES.LANDING);

    // Hero heading
    await expect(page.getByRole('heading', { name: /Build Type-Safe GraphQL Apps/i })).toBeVisible({ timeout: 15_000 });

    // CTA buttons with correct hrefs
    const getStarted = page.getByRole('link', { name: /Get Started/i });
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toHaveAttribute('href', '/login');

    const viewExamples = page.getByRole('link', { name: /View Examples/i });
    await expect(viewExamples).toBeVisible();
    await expect(viewExamples).toHaveAttribute('href', '/examples');

    // Header with brand text
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'Axolotl' })).toBeVisible();

    // Main content area
    await expect(page.locator('main')).toBeVisible();
  });

  test('login page loads correctly', async ({ loginPage }) => {
    await loginPage.goto();

    // Heading
    await expect(loginPage.heading).toBeVisible();

    // Auth mode toggle buttons
    await expect(loginPage.loginToggle).toBeVisible();
    await expect(loginPage.registerToggle).toBeVisible();

    // Form fields
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    // Submit button defaults to Sign In
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toHaveText(/Sign In/i);
  });

  test('protected routes redirect to login', async ({ page }) => {
    // /app should redirect to /login
    await page.goto(ROUTES.DASHBOARD);
    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));

    // /settings should also redirect to /login
    await page.goto(ROUTES.SETTINGS);
    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});

// ============================================================================
// Authenticated Smoke Tests
// ============================================================================

test.describe('Authenticated smoke tests', () => {
  test('authenticated users are redirected away from guest login route', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.DASHBOARD));
  });

  test('authenticated app structure', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();

    // Dashboard heading
    await expect(dashboardPage.heading).toBeVisible({ timeout: 15_000 });

    // Document title
    await expect(page).toHaveTitle(/Dashboard|Axolotl/i);

    // Top nav bar with brand and nav links
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'Axolotl' })).toBeVisible();

    const myTodosLink = page.getByRole('link', { name: /My Todos/i });
    const examplesLink = page.getByRole('link', { name: /Examples/i });

    await ensureAuthenticatedTopNav({
      userMenuTrigger: dashboardPage.userMenuTrigger,
      myTodosLink,
      page,
    });

    await expect(myTodosLink).toBeVisible();
    await expect(examplesLink).toBeVisible();

    // Avatar dropdown contains Settings and Logout
    await dashboardPage.openUserMenu();

    await expect(dashboardPage.userMenuSettingsAction).toBeVisible();
    await expect(dashboardPage.userMenuLogoutAction).toBeVisible();

    // Navigate to Settings via dropdown
    await dashboardPage.userMenuSettingsAction.click();
    await page.waitForURL(`**${ROUTES.SETTINGS}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.SETTINGS));

    // Settings page has correct heading
    await expect(page.getByRole('heading', { name: /^Settings$/i })).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});
