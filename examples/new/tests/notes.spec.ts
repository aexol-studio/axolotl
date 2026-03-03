/**
 * Notes CRUD Tests — verify create, list, and delete operations.
 *
 * Runs in the `chromium-auth` project with pre-loaded storageState,
 * so the user is already authenticated on every test.
 *
 * Notes live on the /examples page under the "Notes" tab.
 */

import { test, expect } from './fixtures';
import { generateNoteContent, ROUTES } from './helpers';
import { waitForPageReady } from './fixtures';

// ============================================================================
// Notes CRUD operations
// ============================================================================

test.describe('Notes CRUD', () => {
  test('can create notes', async ({ page }) => {
    await page.goto(ROUTES.EXAMPLES);
    await waitForPageReady(page);

    // Open the Notes tab
    await page.getByRole('tab', { name: 'Notes' }).click();
    await expect(page.getByText('Your Notes')).toBeVisible({ timeout: 10_000 });

    // The authenticated create form should be visible
    await expect(page.getByText('Create a Note')).toBeVisible();
    await expect(page.getByPlaceholder('Write a note...')).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Note/ })).toBeVisible();

    // Create a note and verify it appears with an Active badge
    const noteText = generateNoteContent();
    await page.getByPlaceholder('Write a note...').fill(noteText);
    await page.getByRole('button', { name: /Create Note/ }).click();

    const noteItem = page.locator('li').filter({ hasText: noteText });
    await expect(noteItem).toBeVisible({ timeout: 10_000 });
    await expect(noteItem.getByText('Active')).toBeVisible();

    // Input should be cleared after successful creation
    await expect(page.getByPlaceholder('Write a note...')).toHaveValue('');
  });

  test('can delete notes without affecting others', async ({ page }) => {
    await page.goto(ROUTES.EXAMPLES);
    await waitForPageReady(page);

    // Open the Notes tab
    await page.getByRole('tab', { name: 'Notes' }).click();
    await expect(page.getByText('Your Notes')).toBeVisible({ timeout: 10_000 });

    // Create two notes
    const noteToKeep = generateNoteContent('Keep Me');
    await page.getByPlaceholder('Write a note...').fill(noteToKeep);
    await page.getByRole('button', { name: /Create Note/ }).click();
    await expect(page.getByText(noteToKeep)).toBeVisible({ timeout: 10_000 });

    const noteToDelete = generateNoteContent('Delete Me');
    await page.getByPlaceholder('Write a note...').fill(noteToDelete);
    await page.getByRole('button', { name: /Create Note/ }).click();
    await expect(page.getByText(noteToDelete)).toBeVisible({ timeout: 10_000 });

    // Delete only the second note
    const noteItem = page.locator('li').filter({ hasText: noteToDelete });
    await noteItem.getByLabel('Delete note').click();

    // The deleted note should be gone, the other should remain
    await expect(page.getByText(noteToDelete)).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(noteToKeep)).toBeVisible();
  });
});
