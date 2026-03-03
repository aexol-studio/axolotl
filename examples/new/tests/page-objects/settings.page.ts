import type { Page, Locator } from '@playwright/test';
import { waitForPageReady } from '../fixtures';
import { ROUTES } from '../helpers';

/**
 * Page object for the Settings page at /settings.
 *
 * Encapsulates interactions with the Profile, Change Password,
 * and Active Sessions sections.
 */
export class SettingsPage {
  /** Page heading "Settings" */
  readonly heading: Locator;
  /** Profile section card title */
  readonly profileSection: Locator;
  /** Change Password section card title */
  readonly changePasswordSection: Locator;
  /** Active Sessions section card title */
  readonly sessionsSection: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /^Settings$/i });
    this.profileSection = page.getByText('Profile', { exact: true });
    this.changePasswordSection = page
      .locator('[class*="card"], section')
      .filter({ hasText: 'Change Password' })
      .filter({ has: page.getByText('Update your password', { exact: false }) });
    this.sessionsSection = page.getByText('Active Sessions', { exact: true });
  }

  /** Navigate to the settings page and wait for it to be ready, retrying on CancelledError */
  async goto() {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      await this.page.goto(ROUTES.SETTINGS);
      await waitForPageReady(this.page);
      // Check if the error boundary rendered instead of the settings page
      const errorHeading = this.page.getByRole('heading', { name: /Something went wrong/i });
      const hasError = await errorHeading.isVisible({ timeout: 1_000 }).catch(() => false);
      if (!hasError) return;
      // Retry by reloading if we hit CancelledError
      if (attempt < maxRetries) {
        await this.page.reload();
        await waitForPageReady(this.page);
      }
    }
  }

  /** Wait for the heading to be visible — confirms page loaded */
  async waitForReady() {
    await this.heading.waitFor({ state: 'visible' });
  }

  /** Check if the Profile section is visible */
  async isProfileVisible(): Promise<boolean> {
    return this.profileSection.isVisible();
  }

  /** Check if the Change Password section is visible */
  async isChangePasswordVisible(): Promise<boolean> {
    return this.changePasswordSection.isVisible();
  }

  /** Check if the Active Sessions section is visible */
  async isSessionsVisible(): Promise<boolean> {
    return this.sessionsSection.isVisible();
  }

  /**
   * Get the user email displayed in the Profile section.
   * The email is shown in a span with font-medium class.
   */
  async getProfileEmail(): Promise<string | null> {
    // The email is displayed next to the User icon in the Profile card
    const profileCard = this.page.locator('section, [class*="card"]').filter({ hasText: /Profile/i });
    const emailSpan = profileCard.locator('.font-medium').first();
    if (await emailSpan.isVisible({ timeout: 3_000 }).catch(() => false)) {
      return emailSpan.textContent();
    }
    return null;
  }

  /**
   * Fill and submit the change password form.
   *
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @param confirmPassword - Confirmation of new password (defaults to newPassword)
   */
  async changePassword(oldPassword: string, newPassword: string, confirmPassword?: string) {
    await this.page.getByLabel('Current Password').fill(oldPassword);
    await this.page.getByLabel('New Password', { exact: true }).fill(newPassword);
    await this.page.getByLabel('Confirm New Password').fill(confirmPassword ?? newPassword);
    await this.page.getByRole('button', { name: /Change Password/i }).click();
  }

  /** Get the count of sessions displayed in the table */
  async getSessionCount(): Promise<number> {
    const rows = this.page.locator('table tbody tr');
    return rows.count();
  }

  /** Check if the "Current" badge is visible for any session */
  async hasCurrentSessionBadge(): Promise<boolean> {
    return this.page
      .getByText('Current', { exact: true })
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
  }

  /**
   * Click the "Revoke All Others" button if visible.
   * Only appears when there are other (non-current) sessions.
   */
  async revokeAllOtherSessions() {
    const revokeAllButton = this.page.getByRole('button', { name: /Revoke All Others/i });
    if (await revokeAllButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await revokeAllButton.click();
    }
  }
}
