/**
 * Settings Tests — verify the settings page for authenticated users.
 *
 * Runs in the `chromium-auth` project with pre-loaded storageState,
 * so the user is already authenticated on every test.
 *
 * Uses the SettingsPage page object for all interactions.
 *
 * Tests are consolidated: each navigates ONCE and asserts multiple things.
 */

import { test, expect, waitForPageReady } from './fixtures';
import { completeRegistrationAuthFlow, ROUTES, generateTestPassword, generateTestEmail } from './helpers';
import { LoginPage, SettingsPage } from './page-objects';
import type { Browser, BrowserContext, Page } from '@playwright/test';

const SESSIONS_QUERY = `
  query Sessions {
    user {
      sessions {
        _id
        isCurrent
      }
    }
  }
`;

const REVOKE_SESSION_MUTATION = `
  mutation RevokeSession($sessionId: String!) {
    user {
      revokeSession(sessionId: $sessionId)
    }
  }
`;

const REVOKE_ALL_MUTATION = `
  mutation RevokeAll {
    user {
      revokeAllSessions
    }
  }
`;

interface SessionCredentials {
  email: string;
  password: string;
}

interface IsolatedSettingsSession {
  context: BrowserContext;
  page: Page;
  settingsPage: SettingsPage;
  credentials: SessionCredentials;
}

const createIsolatedSettingsSession = async (browser: Browser): Promise<IsolatedSettingsSession> => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const settingsPage = new SettingsPage(page);

  const credentials: SessionCredentials = {
    email: generateTestEmail(),
    password: generateTestPassword(),
  };

  await loginPage.goto();
  await loginPage.waitForReady();
  await completeRegistrationAuthFlow({
    page,
    loginPage,
    email: credentials.email,
    password: credentials.password,
  });
  await waitForPageReady(page);

  return {
    context,
    page,
    settingsPage,
    credentials,
  };
};

const createAdditionalSessions = async (params: {
  browser: Browser;
  count: number;
  credentials: SessionCredentials;
}) => {
  const { browser, count, credentials } = params;

  for (let index = 0; index < count; index += 1) {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const sessionPage = await context.newPage();
    const sessionLoginPage = new LoginPage(sessionPage);

    await sessionLoginPage.goto();
    await sessionLoginPage.waitForReady();
    await sessionLoginPage.login(credentials.email, credentials.password);
    await sessionPage.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });
    await waitForPageReady(sessionPage);

    await context.close();
  }
};

const ensureRevokableSessionPrecondition = async (params: {
  browser: Browser;
  settingsPage: SettingsPage;
  credentials: SessionCredentials;
}) => {
  const { browser, settingsPage, credentials } = params;

  await createAdditionalSessions({
    browser,
    count: 1,
    credentials,
  });

  await settingsPage.goto();
  await settingsPage.waitForReady();

  await expect
    .poll(async () => (await querySessionIds(settingsPage)).other.length, { timeout: 20_000 })
    .toBeGreaterThan(0);
};

const querySessionIds = async (settingsPage: SettingsPage): Promise<{ current: string[]; other: string[] }> => {
  const response = await settingsPage.request.post('/graphql', {
    data: { query: SESSIONS_QUERY },
  });

  const payload = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: {
      user?: {
        sessions?: Array<{ _id: string; isCurrent: boolean }>;
      };
    };
  };

  if (!response.ok() || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message ?? `Failed to query sessions (HTTP ${response.status()})`);
  }

  const sessions = payload.data?.user?.sessions ?? [];
  return {
    current: sessions.filter((session) => session.isCurrent).map((session) => session._id),
    other: sessions.filter((session) => !session.isCurrent).map((session) => session._id),
  };
};

const revokeSessionById = async (settingsPage: SettingsPage, sessionId: string) => {
  const response = await settingsPage.request.post('/graphql', {
    data: {
      query: REVOKE_SESSION_MUTATION,
      variables: { sessionId },
    },
  });

  const payload = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: { user?: { revokeSession?: boolean } };
  };

  if (!response.ok() || payload.errors?.length || !payload.data?.user?.revokeSession) {
    throw new Error(payload.errors?.[0]?.message ?? `Failed to revoke session ${sessionId}`);
  }
};

const revokeAllSessions = async (settingsPage: SettingsPage) => {
  const response = await settingsPage.request.post('/graphql', {
    data: {
      query: REVOKE_ALL_MUTATION,
    },
  });

  const payload = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: { user?: { revokeAllSessions?: boolean } };
  };

  if (!response.ok() || payload.errors?.length || !payload.data?.user?.revokeAllSessions) {
    throw new Error(payload.errors?.[0]?.message ?? 'Failed to revoke all sessions');
  }
};

test.describe('Settings page', () => {
  test('page structure and sections are visible', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(settingsPage.errorBoundaryHeading).toBeHidden();
    await expect(settingsPage.heading).toBeVisible();
    await expect(page.getByText(/Manage your account settings and preferences/i)).toBeVisible();
    await expect(settingsPage.profileSection).toBeVisible();
    await expect(settingsPage.changePasswordSection).toBeVisible();
    await expect(settingsPage.sessionsSection).toBeVisible();
    await expect(page.getByText('Danger Zone', { exact: true })).toBeVisible();
  });

  test('profile section shows user info', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(settingsPage.errorBoundaryHeading).toBeHidden();
    const email = await settingsPage.getProfileEmail();
    expect(email).toBeTruthy();
    expect(email).toContain('@');

    await expect(page.getByText(/Member since/i)).toBeVisible();

    const avatarCircle = page.locator('.rounded-full.bg-primary');
    await expect(avatarCircle).toBeVisible();
  });

  test('change password form has all fields', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(settingsPage.errorBoundaryHeading).toBeHidden();
    await expect(page.getByText(/Update your password to keep your account secure/i)).toBeVisible();
    await expect(page.getByLabel('Current Password')).toBeVisible();
    await expect(page.getByLabel('New Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm New Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Change Password/i })).toBeVisible();
  });

  test('active sessions section shows data', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(settingsPage.errorBoundaryHeading).toBeHidden();
    await expect(page.getByText(/Manage your active sessions across devices/i)).toBeVisible();

    const sessionCount = await settingsPage.getSessionCount();
    expect(sessionCount).toBeGreaterThanOrEqual(1);

    const hasBadge = await settingsPage.hasCurrentSessionBadge();
    expect(hasBadge).toBe(true);

    await expect(page.getByRole('columnheader', { name: /Device/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Status/i })).toBeVisible();
  });

  test('change password success and restore original password', async ({ browser }) => {
    const isolatedSession = await createIsolatedSettingsSession(browser);

    try {
      await isolatedSession.settingsPage.goto();
      await isolatedSession.settingsPage.waitForReady();

      await expect(isolatedSession.settingsPage.errorBoundaryHeading).toBeHidden();

      const temporaryPassword = generateTestPassword();

      await isolatedSession.settingsPage.changePassword(isolatedSession.credentials.password, temporaryPassword);
      await expect(isolatedSession.page.getByText('Password changed successfully', { exact: true })).toBeVisible({
        timeout: 10_000,
      });

      await isolatedSession.settingsPage.changePassword(temporaryPassword, isolatedSession.credentials.password);
      await expect(isolatedSession.page.getByText('Password changed successfully', { exact: true })).toBeVisible({
        timeout: 10_000,
      });
    } finally {
      await isolatedSession.context.close();
    }
  });

  test('change password fails with invalid current password', async ({ settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(settingsPage.errorBoundaryHeading).toBeHidden();

    await settingsPage.changePassword('InvalidCurrentPassword!123', generateTestPassword());
    await expect(settingsPage.changePasswordErrorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('revoke single session removes one revokable row', async ({ browser }) => {
    const isolatedSession = await createIsolatedSettingsSession(browser);

    try {
      await ensureRevokableSessionPrecondition({
        browser,
        settingsPage: isolatedSession.settingsPage,
        credentials: isolatedSession.credentials,
      });

      const beforeSessions = await querySessionIds(isolatedSession.settingsPage);
      expect(beforeSessions.other.length).toBeGreaterThanOrEqual(1);

      await revokeSessionById(isolatedSession.settingsPage, beforeSessions.other[0]);
      await expect
        .poll(async () => (await querySessionIds(isolatedSession.settingsPage)).other.length, { timeout: 20_000 })
        .toBe(beforeSessions.other.length - 1);
    } finally {
      await isolatedSession.context.close();
    }
  });

  test('revoke all other sessions clears remaining revokable sessions', async ({ browser }) => {
    const isolatedSession = await createIsolatedSettingsSession(browser);

    try {
      await ensureRevokableSessionPrecondition({
        browser,
        settingsPage: isolatedSession.settingsPage,
        credentials: isolatedSession.credentials,
      });

      const beforeSessions = await querySessionIds(isolatedSession.settingsPage);
      expect(beforeSessions.other.length).toBeGreaterThanOrEqual(1);

      await revokeAllSessions(isolatedSession.settingsPage);
      await expect
        .poll(async () => (await querySessionIds(isolatedSession.settingsPage)).other.length, { timeout: 20_000 })
        .toBe(0);
    } finally {
      await isolatedSession.context.close();
    }
  });

  test('delete account logs out and blocks access to protected area', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const isolatedSettingsPage = new SettingsPage(page);

    const email = generateTestEmail();
    const password = generateTestPassword();

    await loginPage.goto();
    await completeRegistrationAuthFlow({
      page,
      loginPage,
      email,
      password,
    });

    await waitForPageReady(page);

    await isolatedSettingsPage.goto();
    await isolatedSettingsPage.waitForReady();
    await isolatedSettingsPage.deleteAccount(password);

    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 30_000 });
    await expect(page).toHaveURL(new RegExp(`${ROUTES.LOGIN}$`));

    await page.goto(ROUTES.DASHBOARD);
    await waitForPageReady(page);
    await page.waitForURL(`**${ROUTES.LOGIN}`, { timeout: 30_000 });
    await expect(page).toHaveURL(new RegExp(`${ROUTES.LOGIN}$`));

    await context.close();
  });
});
