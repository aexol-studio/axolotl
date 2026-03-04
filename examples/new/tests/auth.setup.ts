import { test as setup } from '@playwright/test';
import { LoginPage } from './page-objects';
import { USER_AUTH_FILE, waitForPageReady } from './fixtures';
import { completeRegistrationAuthFlow, generateTestEmail, generateTestPassword, saveAuthSetupUser } from './helpers';

/**
 * Auth Setup — creates authenticated browser state for E2E tests.
 *
 * Registers a fresh user for each run, handles verification if needed,
 * and persists both auth storage state and generated credentials.
 *
 * After successful login, saves cookies (incl. httpOnly auth-token) to
 * `.playwright/user-auth.json` so the `chromium-auth` project can reuse it.
 */
setup('authenticate as user', async ({ page }) => {
  setup.setTimeout(120_000);

  const loginPage = new LoginPage(page);

  const testEmail = generateTestEmail();
  const testPassword = generateTestPassword();
  console.log(`[AUTH SETUP] Registering new user ${testEmail}`);

  // ── Step 1: Register ─────────────────────────────────────────────────────
  await loginPage.goto();
  await loginPage.waitForReady();

  const authResult = await completeRegistrationAuthFlow({
    page,
    loginPage,
    email: testEmail,
    password: testPassword,
  });

  if (authResult.verificationDisabled) {
    console.log('[AUTH SETUP] Registration auto-logged in (verification disabled)');
  } else {
    console.log('[AUTH SETUP] Verification required — waiting for verification email...');
    if (authResult.verificationPath) {
      console.log(`[AUTH SETUP] Verification path received: ${authResult.verificationPath.slice(0, 80)}...`);
    }
    console.log('[AUTH SETUP] Email verification link consumed successfully');

    if (authResult.requiredManualLogin) {
      console.log('[AUTH SETUP] Not redirected to dashboard — logged in manually');
    } else {
      console.log('[AUTH SETUP] Already authenticated after verification — redirected to dashboard');
    }
  }

  await waitForPageReady(page);

  // ── Step 5: Save auth state ──────────────────────────────────────────────
  await page.context().storageState({ path: USER_AUTH_FILE });
  saveAuthSetupUser({ email: testEmail, password: testPassword });
  console.log(
    `[AUTH SETUP] Completed for ${testEmail} (${authResult.verificationDisabled ? 'no verification' : 'with verification'})`,
  );
});
