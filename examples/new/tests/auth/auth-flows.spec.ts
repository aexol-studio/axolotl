/**
 * Auth Flows — Login & Register UI Tests
 *
 * Tests run WITHOUT authentication (chromium project, NOT chromium-auth).
 * Consolidated tests that verify the login/register page structure, mode toggle,
 * form validation, and credential-based auth flows with minimal page navigations.
 */

import { test, expect } from '../fixtures';
import {
  completeRegistrationAuthFlow,
  ROUTES,
  generateTestPassword,
  generateTestEmail,
  isEmailVerificationDisabled,
} from '../helpers';
import { LoginPage } from '../page-objects';

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
  test('logs in and redirects to dashboard', async ({ loginPage, page, browser }) => {
    const email = generateTestEmail();
    const password = generateTestPassword();

    await loginPage.goto();
    await completeRegistrationAuthFlow({ page, loginPage, email, password });

    const isolatedContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const isolatedPage = await isolatedContext.newPage();
    const isolatedLoginPage = new LoginPage(isolatedPage);

    await isolatedLoginPage.goto();
    await isolatedLoginPage.waitForReady();
    await isolatedLoginPage.login(email, password);

    await isolatedPage.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });
    await expect(isolatedPage).toHaveURL(new RegExp(ROUTES.DASHBOARD));

    await isolatedContext.close();
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
  test.use({ storageState: { cookies: [], origins: [] } });

  test('register auto-logs in when verification is disabled', async ({ loginPage, page }) => {
    test.skip(!isEmailVerificationDisabled(), 'Only valid when DISABLE_EMAIL_VERIFICATION=true');

    const uniqueEmail = `e2e-test-${Date.now()}@example.com`;
    const password = generateTestPassword();

    await loginPage.goto();
    await completeRegistrationAuthFlow({
      page,
      loginPage,
      email: uniqueEmail,
      password,
    });

    const verificationText = page.getByText('Check your email', { exact: true });
    const dashboardHeading = page.getByRole('heading', { name: /My Todos/i });

    // Starter app default has email verification disabled.
    // This assertion is intentionally strict: landing in verify-required branch is a failure.
    await expect(page).toHaveURL(new RegExp(`${ROUTES.DASHBOARD}$`));
    await expect(dashboardHeading).toBeVisible({ timeout: 15_000 });
    await expect(verificationText).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(
      /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
    );
  });
});

// ============================================================================
// Logout flow
// ============================================================================

test.describe('Logout flow', () => {
  test('logs out and redirects to login page', async ({ loginPage, dashboardPage, page }) => {
    const email = generateTestEmail();
    const password = generateTestPassword();

    // First, log in
    await loginPage.goto();
    await completeRegistrationAuthFlow({ page, loginPage, email, password });

    // Click the avatar/profile dropdown to reveal the logout button
    await dashboardPage.openUserMenu();

    // Click Logout in the dropdown
    const logoutItem = dashboardPage.userMenuLogoutAction;
    await expect(logoutItem).toBeVisible();
    await logoutItem.click();

    // Should redirect to login page
    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});
