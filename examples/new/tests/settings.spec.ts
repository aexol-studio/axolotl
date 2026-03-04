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

import { test, expect } from './fixtures';

test.describe('Settings page', () => {
  test('page structure and sections are visible', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

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

    await expect(page.getByText(/Update your password to keep your account secure/i)).toBeVisible();
    await expect(page.getByLabel('Current Password')).toBeVisible();
    await expect(page.getByLabel('New Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm New Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Change Password/i })).toBeVisible();
  });

  test('active sessions section shows data', async ({ page, settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.waitForReady();

    await expect(page.getByText(/Manage your active sessions across devices/i)).toBeVisible();

    const sessionCount = await settingsPage.getSessionCount();
    expect(sessionCount).toBeGreaterThanOrEqual(1);

    const hasBadge = await settingsPage.hasCurrentSessionBadge();
    expect(hasBadge).toBe(true);

    await expect(page.getByRole('columnheader', { name: /Device/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Status/i })).toBeVisible();
  });
});
