import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Global Setup — runs BEFORE all Playwright tests.
 *
 * Responsibilities:
 * 1. Ensure the .playwright/ directory exists for auth state storage
 * 2. When TESTING_USER_EMAIL is set (local dev with a pre-existing user),
 *    clean up leftover test data from previous runs via Prisma
 *
 * When TESTING_USER_EMAIL is NOT set (CI with fresh registration),
 * only the directory creation step runs.
 */
const globalSetup = async () => {
  // -------------------------------------------------------------------
  // Step 1: Ensure .playwright/ directory exists
  // -------------------------------------------------------------------
  const playwrightDir = path.join(__dirname, '..', '.playwright');
  if (!fs.existsSync(playwrightDir)) {
    fs.mkdirSync(playwrightDir, { recursive: true });
    console.log('[GLOBAL SETUP] Created .playwright/ directory.');
  }

  // -------------------------------------------------------------------
  // Step 2: Prisma-based cleanup for test data (when pre-existing user)
  // -------------------------------------------------------------------
  const testEmail = process.env.TESTING_USER_EMAIL;

  if (!testEmail) {
    console.log('[GLOBAL SETUP] TESTING_USER_EMAIL not set — skipping cleanup.');
    return;
  }

  console.log(`[GLOBAL SETUP] Cleaning up test data for ${testEmail}...`);

  // Dynamic import to avoid requiring Prisma when not needed
  // (e.g., when running against a remote environment without local DB access)
  let prisma: Awaited<typeof import('../backend/src/db')>['prisma'] | null = null;

  try {
    const db = await import('../backend/src/db');
    prisma = db.prisma;
  } catch (err) {
    console.warn('[GLOBAL SETUP] Could not import Prisma client (non-fatal):', (err as Error).message);
    console.warn('[GLOBAL SETUP] Skipping database cleanup — ensure TESTING_USER_EMAIL user exists.');
    return;
  }

  try {
    // ---------------------------------------------------------------
    // Look up the user by email
    // ---------------------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      select: { id: true },
    });

    if (!user) {
      console.warn(`[GLOBAL SETUP] User not found for email ${testEmail} — skipping cleanup.`);
      return;
    }

    const userId = user.id;

    // ===============================================================
    // Phase 1: Delete leaf / dependent rows (FK children first)
    // ===============================================================

    // --- Email verification tokens ---
    const deletedTokens = await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
    console.log(`[GLOBAL SETUP] Deleted ${deletedTokens.count} email verification token(s).`);

    // --- Sessions (except we'll let auth setup recreate them) ---
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId },
    });
    console.log(`[GLOBAL SETUP] Deleted ${deletedSessions.count} session(s).`);

    // --- Todos ---
    const deletedTodos = await prisma.todo.deleteMany({
      where: { ownerId: userId },
    });
    console.log(`[GLOBAL SETUP] Deleted ${deletedTodos.count} todo(s).`);

    // --- Notes ---
    const deletedNotes = await prisma.note.deleteMany({
      where: { userId },
    });
    console.log(`[GLOBAL SETUP] Deleted ${deletedNotes.count} note(s).`);

    console.log('[GLOBAL SETUP] Cleanup complete.');
  } catch (err) {
    // Log but don't fail — tests should still attempt to run
    console.error('[GLOBAL SETUP] Cleanup error (non-fatal):', (err as Error).message);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

export default globalSetup;
