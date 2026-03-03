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

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /My Todos/i });
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.todoList = page.locator('ul');
  }

  /** Navigate to the dashboard and wait for it to be ready, retrying on CancelledError */
  async goto() {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      await this.page.goto(ROUTES.DASHBOARD);
      await waitForPageReady(this.page);
      // Check if the error boundary rendered instead of the dashboard
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
