import { expect, test as setup } from '@playwright/test';
import { LoginPage } from './page-objects';
import { USER_AUTH_FILE, waitForPageReady } from './fixtures';
import {
  TESTING_USER_EMAIL,
  TESTING_USER_PASSWORD,
  ROUTES,
  generateTestEmail,
  generateTestPassword,
  waitForVerificationLink,
} from './helpers';

/**
 * Auth Setup — creates authenticated browser state for E2E tests.
 *
 * Two paths:
 * - **Fast path** (TESTING_USER_EMAIL set): login with pre-existing user
 * - **Slow path** (no env vars): register new user → handle verification if needed → login
 *
 * After successful login, saves cookies (incl. httpOnly auth-token) to
 * `.playwright/user-auth.json` so the `chromium-auth` project can reuse it.
 */
setup('authenticate as user', async ({ page }) => {
  setup.setTimeout(120_000);

  const loginPage = new LoginPage(page);

  // ===========================================================================
  // Fast path: skip registration when pre-existing user is configured
  // ===========================================================================
  if (TESTING_USER_EMAIL) {
    console.log(`[AUTH SETUP] Fast-path: logging in as pre-existing user ${TESTING_USER_EMAIL}`);

    await loginPage.goto();
    await loginPage.waitForReady();

    await loginPage.login(TESTING_USER_EMAIL, TESTING_USER_PASSWORD);

    // Wait for redirect to dashboard
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });
    await waitForPageReady(page);

    await page.context().storageState({ path: USER_AUTH_FILE });
    console.log(`[AUTH SETUP] Fast-path login completed for ${TESTING_USER_EMAIL}`);
    return;
  }

  // ===========================================================================
  // Slow path: register new user → verify email if needed → login
  // ===========================================================================
  const testEmail = generateTestEmail();
  const testPassword = generateTestPassword();
  console.log(`[AUTH SETUP] Slow-path: registering new user ${testEmail}`);

  // ── Step 1: Register ─────────────────────────────────────────────────────
  await loginPage.goto();
  await loginPage.waitForReady();

  await loginPage.register(testEmail, testPassword);

  // After registration, two possible outcomes:
  // A) Verification OFF → auto-login → redirect to dashboard
  // B) Verification ON → "Check your email" screen shown

  // Wait for either outcome — dashboard redirect OR verification message
  const verificationText = page.getByText('Check your email', { exact: true });
  const dashboardHeading = page.getByText(/My Todos/i);

  await expect(verificationText.or(dashboardHeading)).toBeVisible({ timeout: 15_000 });

  const dashboardOrVerification = (await dashboardHeading.isVisible().catch(() => false))
    ? ('dashboard' as const)
    : ('verification' as const);

  if (dashboardOrVerification === 'dashboard') {
    // Verification is OFF — user was auto-logged in
    console.log('[AUTH SETUP] Registration auto-logged in (verification disabled)');
    await waitForPageReady(page);
    await page.context().storageState({ path: USER_AUTH_FILE });
    console.log(`[AUTH SETUP] Slow-path completed for ${testEmail} (no verification)`);
    return;
  }

  // ── Step 2: Verification is ON — wait for email ──────────────────────────
  console.log('[AUTH SETUP] Verification required — waiting for verification email...');

  const verificationLink = await waitForVerificationLink(testEmail, 60_000);
  console.log(`[AUTH SETUP] Verification link received: ${verificationLink.slice(0, 80)}...`);

  // ── Step 3: Visit verification link ──────────────────────────────────────
  await page.goto(verificationLink);
  await waitForPageReady(page);

  // Expect the verification page to show success
  await expect(page.getByText(/verified|success/i)).toBeVisible({ timeout: 15_000 });
  console.log('[AUTH SETUP] Email verified successfully');

  // ── Step 4: Log in with verified account ─────────────────────────────────
  // After verification, the app may auto-redirect to dashboard.
  // Wait briefly for any redirect to settle, then check the URL.
  try {
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 10_000 });
    console.log('[AUTH SETUP] Already authenticated after verification — redirected to dashboard');
  } catch {
    // No redirect to dashboard — need to log in manually
    console.log('[AUTH SETUP] Not redirected to dashboard — logging in manually');
    await loginPage.goto();
    await loginPage.waitForReady();
    await loginPage.login(testEmail, testPassword);
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });
  }
  await waitForPageReady(page);

  // ── Step 5: Save auth state ──────────────────────────────────────────────
  await page.context().storageState({ path: USER_AUTH_FILE });
  console.log(`[AUTH SETUP] Slow-path completed for ${testEmail} (with verification)`);
});
