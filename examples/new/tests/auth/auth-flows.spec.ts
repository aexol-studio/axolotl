/**
 * Auth Flows — Login & Register UI Tests
 *
 * Tests run WITHOUT authentication (chromium project, NOT chromium-auth).
 * Consolidated tests that verify the login/register page structure, mode toggle,
 * form validation, and credential-based auth flows with minimal page navigations.
 */

import { test, expect } from '../fixtures';
import { ROUTES, TESTING_USER_EMAIL, TESTING_USER_PASSWORD, generateTestPassword } from '../helpers';

// ============================================================================
// Login page structure and mode toggle
// ============================================================================

test.describe('Login page structure and interactions', () => {
  test('login page has correct structure and mode toggle', async ({ loginPage }) => {
    await loginPage.goto();

    // Page heading
    await expect(loginPage.heading).toBeVisible();

    // Form fields visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    // Default mode is Login with Sign In button
    await expect(loginPage.loginToggle).toBeVisible();
    await expect(loginPage.registerToggle).toBeVisible();
    await expect(loginPage.submitButton).toHaveText(/Sign In/i);

    // Switch to Register — button changes to Sign Up
    await loginPage.switchToRegister();
    await expect(loginPage.submitButton).toHaveText(/Sign Up/i);

    // Switch back to Login — button restores to Sign In
    await loginPage.switchToLogin();
    await expect(loginPage.submitButton).toHaveText(/Sign In/i);
  });

  test('form validates input', async ({ loginPage, page }) => {
    await loginPage.goto();

    // Test short password — Zod validates this (no native HTML5 minlength)
    await loginPage.fillForm('test@example.com', '12345');
    await loginPage.submit();
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible({ timeout: 5_000 });
  });
});

// ============================================================================
// Credential-based auth flows
// ============================================================================

test.describe('Login with valid credentials', () => {
  test.skip(!TESTING_USER_EMAIL, 'TESTING_USER_EMAIL not set — skipping login test');

  test('logs in and redirects to dashboard', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(TESTING_USER_EMAIL!, TESTING_USER_PASSWORD);

    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.DASHBOARD));
  });
});

test.describe('Login with invalid credentials', () => {
  test('shows error for wrong password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent-user@example.com', 'WrongPassword123!');

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
});

// ============================================================================
// Register flow
// ============================================================================

test.describe('Register flow', () => {
  test('can register a new account', async ({ loginPage, page }) => {
    const uniqueEmail = `e2e-test-${Date.now()}@example.com`;
    const password = generateTestPassword();

    await loginPage.goto();
    await loginPage.register(uniqueEmail, password);

    // After registration, one of two outcomes:
    // A) Verification OFF → redirect to dashboard
    // B) Verification ON → "Check your email" message
    // Wait for either — whichever appears first
    await expect(page.getByText('Check your email', { exact: true }).or(page.locator('text=My Todos'))).toBeVisible({
      timeout: 15_000,
    });
  });
});

// ============================================================================
// Logout flow
// ============================================================================

test.describe('Logout flow', () => {
  test.skip(!TESTING_USER_EMAIL, 'TESTING_USER_EMAIL not set — skipping logout test');

  test('logs out and redirects to login page', async ({ loginPage, page }) => {
    // First, log in
    await loginPage.goto();
    await loginPage.login(TESTING_USER_EMAIL!, TESTING_USER_PASSWORD);
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });

    // Click the avatar/profile dropdown to reveal the logout button
    const avatarButton = page.locator('button').filter({ has: page.locator('[class*="avatar"]') });
    await avatarButton.click();

    // Click Logout in the dropdown
    const logoutItem = page.getByRole('menuitem', { name: /Logout/i });
    await expect(logoutItem).toBeVisible();
    await logoutItem.click();

    // Should redirect to login page
    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});
