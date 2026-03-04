/**
 * Notes CRUD Tests — verify create, list, and delete operations.
 *
 * Runs in the `chromium-auth` project with pre-loaded storageState,
 * so the user is already authenticated on every test.
 *
 * Notes live on the /examples page under the "Notes" tab.
 */

import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import { LoginPage, NotesPage } from './page-objects';
import { generateNoteContent, readAuthSetupUser, ROUTES } from './helpers';

const ensureAuthenticatedNotesCreateControls = async (params: { notesPage: NotesPage; page: Page }) => {
  const { notesPage, page } = params;
  const hasCreateInput = await notesPage.createInput.isVisible().catch(() => false);

  if (hasCreateInput) {
    return;
  }

  const hasGuestState = await notesPage.guestStateMessage.isVisible().catch(() => false);

  if (!hasGuestState) {
    await expect(notesPage.createInput).toBeVisible({ timeout: 10_000 });
    await expect(notesPage.createSubmit).toBeVisible({ timeout: 10_000 });
    return;
  }

  const { email, password } = readAuthSetupUser();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.waitForReady();
  await loginPage.login(email, password);
  await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 30_000 });

  await notesPage.goto();
  await notesPage.openNotesTab();
  await expect(notesPage.createInput).toBeVisible({ timeout: 10_000 });
  await expect(notesPage.createSubmit).toBeVisible({ timeout: 10_000 });
};

// ============================================================================
// Notes CRUD operations
// ============================================================================

test.describe('Notes CRUD', () => {
  test('can create notes', async ({ notesPage, page }) => {
    await notesPage.goto();
    await notesPage.openNotesTab();

    await ensureAuthenticatedNotesCreateControls({ notesPage, page });

    // Create a note and verify it appears with an Active badge
    const noteText = generateNoteContent();
    await notesPage.createNote(noteText);

    const noteItem = notesPage.getNoteByText(noteText);
    await expect(noteItem).toBeVisible({ timeout: 10_000 });
    await expect(noteItem.getByText('Active')).toBeVisible();

    // Input should be cleared after successful creation
    await expect(notesPage.createInput).toHaveValue('');
  });

  test('can delete notes without affecting others', async ({ notesPage, page }) => {
    await notesPage.goto();
    await notesPage.openNotesTab();

    await ensureAuthenticatedNotesCreateControls({ notesPage, page });

    // Create two notes
    const noteToKeep = generateNoteContent('Keep Me');
    await notesPage.createNote(noteToKeep);
    await expect(notesPage.getNoteByText(noteToKeep)).toBeVisible({ timeout: 10_000 });

    const noteToDelete = generateNoteContent('Delete Me');
    await notesPage.createNote(noteToDelete);
    await expect(notesPage.getNoteByText(noteToDelete)).toBeVisible({ timeout: 10_000 });

    // Delete only the second note
    await notesPage.getDeleteButtonByNoteText(noteToDelete).click();

    // The deleted note should be gone, the other should remain
    await expect(notesPage.getNoteByText(noteToDelete)).toHaveCount(0, { timeout: 10_000 });
    await expect(notesPage.getNoteByText(noteToKeep)).toBeVisible();
  });
});

test.describe('Notes negative paths', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('guest sees notes unauthenticated state and no create controls', async ({ notesPage }) => {
    await notesPage.goto();
    await notesPage.openNotesTab();

    await expect(notesPage.guestStateMessage).toBeVisible({ timeout: 10_000 });
    await expect(notesPage.createForm).toHaveCount(0);
    await expect(notesPage.createInput).toHaveCount(0);
    await expect(notesPage.createSubmit).toHaveCount(0);
  });
});

test.describe('Notes validation', () => {
  test('invalid note submission shows validation error and does not create note', async ({ notesPage }) => {
    await notesPage.goto();
    await notesPage.openNotesTab();

    const validControlNote = generateNoteContent('Validation Control Note');
    await notesPage.createNote(validControlNote);
    await expect(notesPage.getNoteByText(validControlNote)).toBeVisible({ timeout: 10_000 });

    const baselineCount = await notesPage.notesItems.count();

    await notesPage.createInput.fill('');
    await notesPage.createSubmit.click();

    await expect(notesPage.validationError).toBeVisible({ timeout: 10_000 });
    await expect(notesPage.notesItems).toHaveCount(baselineCount);
    await expect(notesPage.getNoteByText(validControlNote)).toBeVisible();
  });
});
