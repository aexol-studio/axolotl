// ============================================================================
// Test Data Generation Helpers
// ============================================================================

/**
 * Pre-existing user credentials for fast-path local dev.
 * When TESTING_USER_EMAIL is set, auth setup skips registration + email verification
 * and just logs in with these credentials.
 */
export const TESTING_USER_EMAIL = process.env.TESTING_USER_EMAIL;
export const TESTING_USER_PASSWORD = process.env.TESTING_USER_PASSWORD || 'TestPassword123!';

/**
 * Base URL for the application under test.
 * Defaults to local dev server; override with E2E_URL env var.
 */
export const E2E_URL = process.env.E2E_URL ?? 'http://localhost:8080';

/** GraphQL endpoint derived from E2E_URL */
export const GRAPHQL_URL = `${E2E_URL}/graphql`;

/**
 * Generate a unique test todo content string.
 *
 * @param prefix - Optional prefix for the todo text
 * @returns A unique todo string with timestamp
 */
export const generateTodoContent = (prefix = 'Test Todo'): string => {
  return `${prefix} ${Date.now()}`;
};

/**
 * Generate a unique test note content string.
 *
 * @param prefix - Optional prefix for the note text
 * @returns A unique note string with timestamp
 */
export const generateNoteContent = (prefix = 'Test Note'): string => {
  return `${prefix} ${Date.now()}`;
};

/**
 * Generate a secure-looking test password.
 *
 * @returns A password string that satisfies minimum requirements
 */
export const generateTestPassword = (): string => {
  return `TestPw${Date.now()}!`;
};

/**
 * Application routes used in tests.
 * Centralised here to avoid magic strings across test files.
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/app',
  SETTINGS: '/settings',
  VERIFY_EMAIL: '/verify-email',
  LANDING: '/',
  EXAMPLES: '/examples',
} as const;
