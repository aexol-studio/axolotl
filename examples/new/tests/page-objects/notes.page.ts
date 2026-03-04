import type { Page, Locator } from '@playwright/test';
import { waitForPageReady } from '../fixtures';
import { ROUTES } from '../helpers';

export class NotesPage {
  readonly notesTabTrigger: Locator;
  readonly notesTabPanel: Locator;
  readonly notesHeading: Locator;
  readonly guestStateMessage: Locator;
  readonly createForm: Locator;
  readonly createInput: Locator;
  readonly createSubmit: Locator;
  readonly validationError: Locator;
  readonly notesList: Locator;
  readonly notesItems: Locator;

  constructor(private readonly page: Page) {
    this.notesTabTrigger = page.getByTestId('examples-notes-tab-trigger');
    this.notesTabPanel = page.getByRole('tabpanel', { name: /notes/i });
    this.notesHeading = page.getByRole('heading', { name: /Your Notes/i });
    this.guestStateMessage = page.getByTestId('notes-guest-state');
    this.createForm = page.getByTestId('notes-create-form');
    this.createInput = page.getByTestId('notes-create-input');
    this.createSubmit = page.getByTestId('notes-create-submit');
    this.validationError = page.getByTestId('notes-create-content-error');
    this.notesList = page.getByTestId('notes-list');
    this.notesItems = page.getByTestId('notes-list-item');
  }

  async goto() {
    await this.page.goto(ROUTES.EXAMPLES);
    await waitForPageReady(this.page);
  }

  async openNotesTab() {
    await this.notesTabTrigger.click();
    await this.notesHeading.waitFor({ state: 'visible', timeout: 10_000 });
    await this.notesTabPanel.waitFor({ state: 'visible', timeout: 10_000 });
  }

  getNoteByText(content: string) {
    return this.notesItems.filter({ hasText: content });
  }

  getDeleteButtonByNoteText(content: string) {
    return this.getNoteByText(content).getByTestId('notes-delete-button');
  }

  async createNote(content: string) {
    await this.createInput.fill(content);
    await this.createSubmit.click();
  }
}
