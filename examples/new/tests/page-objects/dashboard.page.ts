import type { Page, Locator } from '@playwright/test';
import { waitForPageReady } from '../fixtures';
import { ROUTES } from '../helpers';

/**
 * Page object for the Dashboard page at /app.
 *
 * Encapsulates interactions with the todo list: creating todos,
 * marking them done, and reading the current todo list.
 */
export class DashboardPage {
  /** Page heading "My Todos" */
  readonly heading: Locator;
  /** Input for new todo content */
  readonly todoInput: Locator;
  /** Add button to submit a new todo */
  readonly addButton: Locator;
  /** The todo list container */
  readonly todoList: Locator;
  /** Top navigation user menu trigger (avatar button) */
  readonly userMenuTrigger: Locator;
  /** Top navigation settings action in user dropdown */
  readonly userMenuSettingsAction: Locator;
  /** Top navigation logout action in user dropdown */
  readonly userMenuLogoutAction: Locator;
  /** Route-level error boundary heading */
  readonly errorBoundaryHeading: Locator;
  /** Dashboard form section heading */
  readonly addNewTodoSection: Locator;
  /** Dashboard list section heading */
  readonly yourTodosSection: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /My Todos/i });
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.todoList = page.locator('ul');
    this.userMenuTrigger = page.getByTestId('topnav-user-menu-trigger');
    this.userMenuSettingsAction = page.getByTestId('topnav-user-menu-settings');
    this.userMenuLogoutAction = page.getByTestId('topnav-user-menu-logout');
    this.errorBoundaryHeading = page.getByRole('heading', { name: /Something went wrong/i });
    this.addNewTodoSection = page.getByRole('heading', { name: /Add New Todo/i });
    this.yourTodosSection = page.getByRole('heading', { name: /Your Todos/i });
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
      `[E2E NAV][Dashboard] attempt=${attempt} route=${ROUTES.DASHBOARD} url=${currentUrl} errorBoundary=true errorMessage=${errorMessage ?? 'none'}`,
    );
  }

  /** Navigate to the dashboard and fail fast on persistent route errors */
  async goto() {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      await this.page.goto(ROUTES.DASHBOARD);
      await waitForPageReady(this.page);

      const hasErrorBoundary = await this.errorBoundaryHeading.isVisible({ timeout: 1_000 }).catch(() => false);
      if (!hasErrorBoundary) return;

      await this.captureNavigationDiagnostics(attempt);

      if (attempt < maxRetries) {
        console.warn(`[E2E NAV][Dashboard] retrying navigation attempt=${attempt + 1}/${maxRetries}`);
      }

      if (attempt === maxRetries) {
        throw new Error(
          `[E2E NAV][Dashboard] failed after ${maxRetries} attempts. route=${ROUTES.DASHBOARD} url=${this.page.url()}`,
        );
      }
    }
  }

  /** Wait for route-defining dashboard signals */
  async waitForReady() {
    await this.heading.waitFor({ state: 'visible' });
    await this.todoInput.waitFor({ state: 'visible' });
    await this.addButton.waitFor({ state: 'visible' });
    await this.addNewTodoSection.waitFor({ state: 'visible' });
    await this.yourTodosSection.waitFor({ state: 'visible' });
  }

  /**
   * Add a new todo item.
   *
   * @param content - The text content for the new todo
   */
  async addTodo(content: string) {
    await this.todoInput.fill(content);
    await this.addButton.click();
  }

  /** Get all todo list items */
  async getTodoItems(): Promise<Locator> {
    return this.todoList.locator('li');
  }

  /** Get the count of todo items currently displayed */
  async getTodoCount(): Promise<number> {
    return this.todoList.locator('li').count();
  }

  /**
   * Find a todo item by its text content.
   *
   * @param content - Text to search for within todo items
   * @returns Locator for the matching todo item
   */
  getTodoByText(content: string): Locator {
    return this.todoList.locator('li').filter({ hasText: content });
  }

  /**
   * Mark a todo as done by clicking its circle button.
   * Finds the todo by text content, then clicks the completion button.
   *
   * @param content - Text content of the todo to mark done
   */
  async markTodoDone(content: string) {
    const todoItem = this.getTodoByText(content);
    // The completion button is the round circle button within the todo item
    await todoItem.getByRole('button').first().click();
  }

  /** Open authenticated user dropdown in TopNav */
  async openUserMenu() {
    await this.userMenuTrigger.click();
  }

  /** Navigate to settings from the TopNav user dropdown */
  async goToSettingsFromUserMenu() {
    await this.openUserMenu();
    await this.userMenuSettingsAction.click();
  }

  /** Logout from the TopNav user dropdown */
  async logoutFromUserMenu() {
    await this.openUserMenu();
    await this.userMenuLogoutAction.click();
  }

  /** Get the welcome text showing the user's email */
  async getWelcomeText(): Promise<string | null> {
    return this.page.locator('text=/Welcome/i').first().textContent();
  }

  /** Check if the empty state message is visible */
  async isEmptyStateVisible(): Promise<boolean> {
    return this.page
      .getByText(/No todos yet/i)
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
  }
}
