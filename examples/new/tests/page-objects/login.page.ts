import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { waitForPageReady } from '../fixtures';
import { ROUTES } from '../helpers';

/**
 * Page object for the Login/Register page at /login.
 *
 * Encapsulates all interactions with the auth form including
 * mode toggling between Login and Register, form filling,
 * and submission.
 */
export class LoginPage {
  /** The page heading "Ready to Start?" */
  readonly heading: Locator;
  /** Login mode toggle button */
  readonly loginToggle: Locator;
  /** Register mode toggle button */
  readonly registerToggle: Locator;
  /** Email input field */
  readonly emailInput: Locator;
  /** Password input field */
  readonly passwordInput: Locator;
  /** Submit button — text changes based on mode (Sign In / Sign Up) */
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /Ready to Start/i });
    this.loginToggle = page.getByRole('button', { name: /^Login$/i });
    this.registerToggle = page.getByRole('button', { name: /^Register$/i });
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /Sign In|Sign Up/i });
  }

  /** Navigate to the login page and wait for it to be ready */
  async goto() {
    await this.page.goto(ROUTES.LOGIN);
    await waitForPageReady(this.page);
  }

  /** Switch to Login mode (if not already) */
  async switchToLogin() {
    await this.loginToggle.click();
    await expect(this.submitButton).toHaveText(/Sign In/i);
  }

  /** Switch to Register mode */
  async switchToRegister() {
    await this.registerToggle.click();
    await expect(this.submitButton).toHaveText(/Sign Up/i);
  }

  /**
   * Fill the auth form with email and password.
   * Does NOT submit — call submit() separately.
   */
  async fillForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /** Click the submit button */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Login with email and password in one step.
   * Ensures Login mode is active, fills the form, and submits.
   */
  async login(email: string, password: string) {
    await this.switchToLogin();
    await this.fillForm(email, password);
    await this.submit();
  }

  /**
   * Register with email and password in one step.
   * Ensures Register mode is active, fills the form, and submits.
   */
  async register(email: string, password: string) {
    await this.switchToRegister();
    await this.fillForm(email, password);
    await this.submit();
  }

  /** Wait for the heading to be visible — confirms page loaded */
  async waitForReady() {
    await this.heading.waitFor({ state: 'visible' });
  }

  /** Get any visible error message on the page */
  async getErrorMessage(): Promise<string | null> {
    const errorEl = this.page.locator('[role="alert"]').first();
    try {
      await errorEl.waitFor({ state: 'visible', timeout: 10_000 });
      return errorEl.textContent();
    } catch {
      return null;
    }
  }
}
