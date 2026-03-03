/**
 * Todo CRUD Tests — verify create, list, and mark-done operations.
 *
 * Runs in the `chromium-auth` project with pre-loaded storageState,
 * so the user is already authenticated on every test.
 *
 * Uses the DashboardPage page object for all interactions.
 */

import { test, expect } from './fixtures';
import { generateTodoContent } from './helpers';

// ============================================================================
// Todo CRUD operations
// ============================================================================

test.describe('Todo CRUD', () => {
  test('can create todos and they appear in list', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForReady();

    // Add first todo and verify it appears
    const firstTodo = generateTodoContent('First Todo');
    await dashboardPage.addTodo(firstTodo);
    await expect(dashboardPage.getTodoByText(firstTodo)).toBeVisible({ timeout: 10_000 });

    // Input should be cleared after successful creation
    await expect(dashboardPage.todoInput).toHaveValue('');

    // Add second todo and verify both are visible
    const secondTodo = generateTodoContent('Second Todo');
    await dashboardPage.addTodo(secondTodo);
    await expect(dashboardPage.getTodoByText(secondTodo)).toBeVisible({ timeout: 10_000 });
    await expect(dashboardPage.getTodoByText(firstTodo)).toBeVisible();

    // The "Your Todos (N)" heading should reflect the count
    await expect(page.getByText(/Your Todos \(\d+\)/)).toBeVisible();
  });

  test('can mark a todo as done', async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForReady();

    // Create a todo, then mark it done
    const todoText = generateTodoContent('Mark Done');
    await dashboardPage.addTodo(todoText);
    await expect(dashboardPage.getTodoByText(todoText)).toBeVisible({ timeout: 10_000 });

    await dashboardPage.markTodoDone(todoText);

    // Verify "Done" badge, line-through styling, and disabled button
    const todoItem = dashboardPage.getTodoByText(todoText);
    await expect(todoItem.getByText('Done')).toBeVisible({ timeout: 10_000 });
    await expect(todoItem.locator('span.line-through')).toBeVisible();
    await expect(todoItem.getByRole('button').first()).toBeDisabled();
  });
});
