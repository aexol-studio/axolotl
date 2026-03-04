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
  readonly request: Page['request'];
  /** Page heading "Settings" */
  readonly heading: Locator;
  /** Profile section card title */
  readonly profileSection: Locator;
  /** Change Password section card title */
  readonly changePasswordSection: Locator;
  /** Active Sessions section card title */
  readonly sessionsSection: Locator;
  /** Settings subtitle under heading */
  readonly settingsSubtitle: Locator;
  /** Route-level error boundary heading */
  readonly errorBoundaryHeading: Locator;
  /** Inline error shown in change password form */
  readonly changePasswordErrorMessage: Locator;
  /** Revoke current row-independent session action buttons */
  readonly revokeSessionButtons: Locator;
  /** Revoke all non-current sessions button */
  readonly revokeAllOtherSessionsButton: Locator;
  /** Delete account destructive action button */
  readonly deleteAccountButton: Locator;
  /** Password input used in delete-account confirmation dialog */
  readonly deleteAccountPasswordInput: Locator;
  /** Delete confirmation button inside dialog */
  readonly deleteAccountConfirmButton: Locator;

  constructor(private readonly page: Page) {
    this.request = page.request;
    this.heading = page.getByRole('heading', { name: /^Settings$/i });
    this.profileSection = page.getByText('Profile', { exact: true });
    this.changePasswordSection = page
      .locator('[class*="card"], section')
      .filter({ hasText: 'Change Password' })
      .filter({ has: page.getByText('Update your password', { exact: false }) });
    this.sessionsSection = page.getByText('Active Sessions', { exact: true });
    this.settingsSubtitle = page.getByText(/Manage your account settings and preferences/i);
    this.errorBoundaryHeading = page.getByRole('heading', { name: /Something went wrong/i });
    this.changePasswordErrorMessage = page.getByText('Failed to change password. Please check your current password.', {
      exact: true,
    });
    this.revokeSessionButtons = page.getByRole('button', { name: /Revoke session/i });
    this.revokeAllOtherSessionsButton = page.getByRole('button', { name: /Revoke All Others/i });
    this.deleteAccountButton = page.getByRole('button', { name: /Delete Account/i });
    this.deleteAccountPasswordInput = page.locator('#delete-password');
    this.deleteAccountConfirmButton = page.getByRole('button', { name: /Delete Permanently/i });
  }

  private async captureNavigationDiagnostics(attempt: number) {
    const currentUrl = this.page.url();
    const errorMessage = await this.page
      .locator('p')
      .filter({ hasText: /error|cancelled|failed|unexpected/i })
      .first()
      .textContent()
      .catch(() => null);

    console.error(
      `[E2E NAV][Settings] attempt=${attempt} route=${ROUTES.SETTINGS} url=${currentUrl} errorBoundary=true errorMessage=${errorMessage ?? 'none'}`,
    );
  }

  /** Navigate to settings and fail fast on persistent route errors */
  async goto() {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      await this.page.goto(ROUTES.SETTINGS);
      await waitForPageReady(this.page);

      const hasErrorBoundary = await this.errorBoundaryHeading.isVisible({ timeout: 1_000 }).catch(() => false);
      if (!hasErrorBoundary) return;

      await this.captureNavigationDiagnostics(attempt);

      if (attempt < maxRetries) {
        console.warn(`[E2E NAV][Settings] retrying navigation attempt=${attempt + 1}/${maxRetries}`);
      }

      if (attempt === maxRetries) {
        throw new Error(
          `[E2E NAV][Settings] failed after ${maxRetries} attempts. route=${ROUTES.SETTINGS} url=${this.page.url()}`,
        );
      }
    }
  }

  /** Wait for route-defining settings signals */
  async waitForReady() {
    await this.heading.waitFor({ state: 'visible' });
    await this.settingsSubtitle.waitFor({ state: 'visible' });
    await this.profileSection.waitFor({ state: 'visible' });
    await this.changePasswordSection.waitFor({ state: 'visible' });
    await this.sessionsSection.waitFor({ state: 'visible' });
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
    if (await this.revokeAllOtherSessionsButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.revokeAllOtherSessionsButton.click();
    }
  }

  /** Revoke the first visible non-current session */
  async revokeSingleOtherSession() {
    const revokeRequest = this.page.waitForResponse(
      (response) =>
        response.url().includes('/graphql') &&
        response.request().method() === 'POST' &&
        response.request().postData()?.includes('revokeSession') === true,
    );

    await this.revokeSessionButtons.first().click();
    await revokeRequest;
  }

  /** Get visible revoke button count (non-current sessions count) */
  async getRevokableSessionCount(): Promise<number> {
    return this.revokeSessionButtons.count();
  }

  /** Confirm delete-account dialog by entering password */
  async deleteAccount(password: string) {
    await this.deleteAccountButton.click();
    await this.deleteAccountPasswordInput.fill(password);
    await this.deleteAccountConfirmButton.click();
  }
}
