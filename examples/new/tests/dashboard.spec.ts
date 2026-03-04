/**
 * Dashboard Tests — verify the dashboard page for authenticated users.
 *
 * Runs in the `chromium-auth` project with pre-loaded storageState,
 * so the user is already authenticated on every test.
 *
 * Uses the DashboardPage page object for all interactions.
 */

import { test, expect } from './fixtures';

// ============================================================================
// Dashboard page structure and content
// ============================================================================

test.describe('Dashboard page', () => {
  test('page structure — heading, input, button, and sections', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForReady();

    // Main heading
    await expect(dashboardPage.heading).toBeVisible({ timeout: 15_000 });

    // Route-level error boundary should not be present
    await expect(dashboardPage.errorBoundaryHeading).toBeHidden();

    // Todo input and Add button
    await expect(dashboardPage.todoInput).toBeVisible();
    await expect(dashboardPage.addButton).toBeVisible();
    await expect(dashboardPage.addButton).toHaveText(/Add/i);

    // Form and list sections
    await expect(page.getByText(/Add New Todo/i)).toBeVisible();
    await expect(page.getByText(/Your Todos/i)).toBeVisible();
  });

  test('user-specific content — welcome message and footer', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForReady();

    // Route-level error boundary should not be present
    await expect(dashboardPage.errorBoundaryHeading).toBeHidden();

    // Welcome text displays "Welcome, {email}"
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toBeTruthy();
    expect(welcomeText).toMatch(/Welcome/i);

    // Footer attribution
    await expect(page.getByText(/Powered by Axolotl/i)).toBeVisible();
  });
});
