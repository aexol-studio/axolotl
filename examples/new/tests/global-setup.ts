import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runE2ePrismaCleanup } from './helpers/e2e-cleanup';
import { EMAIL_MODE, DISABLE_EMAIL_VERIFICATION } from '../backend/src/config/env.js';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Global Setup — runs BEFORE all Playwright tests.
 *
 * Responsibilities:
 * 1. Ensure the .playwright/ directory exists for auth state storage
 * 2. Best-effort cleanup for stale E2E users created with e2e-test-* emails
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
  // Step 2: Prisma-based cleanup for stale E2E users
  // -------------------------------------------------------------------
  await runE2ePrismaCleanup('GLOBAL SETUP');

  // -------------------------------------------------------------------
  // Step 3: Fail-fast when verification needs local email artifacts
  // -------------------------------------------------------------------
  if (!DISABLE_EMAIL_VERIFICATION && EMAIL_MODE !== 'local') {
    throw new Error(
      `[GLOBAL SETUP] Invalid email test configuration: DISABLE_EMAIL_VERIFICATION=false requires EMAIL_MODE=local. Current EMAIL_MODE=${EMAIL_MODE}.`,
    );
  }
};

export default globalSetup;
