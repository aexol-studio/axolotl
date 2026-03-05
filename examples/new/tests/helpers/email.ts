import type { Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { DISABLE_EMAIL_VERIFICATION } from '../../backend/src/config/env';

// ============================================================================
// Email Testing Helpers — Local File Reader
// ============================================================================

const EMAIL_ARTIFACTS_RELATIVE_PATH = ['temp', 'emails'] as const;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STARTER_APP_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Generate a unique test email address for registration.
 * Format: e2e-test-{timestamp}@example.com
 */
export const generateTestEmail = (): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `e2e-test-${timestamp}-${randomSuffix}@example.com`;
};

/**
 * Extract a link from email HTML content using a regex capture group.
 *
 * @param html - The HTML content of the email
 * @param linkPattern - Regex pattern to match the link (should have a capture group)
 * @returns The extracted link URL, or null if not found
 *
 * @example
 * ```typescript
 * const link = extractLinkFromEmail(html, /href="(https?:\/\/[^\"]*verify-email[^\"]*)"/i);
 * ```
 */
export const extractLinkFromEmail = (html: string, linkPattern: RegExp): string | null => {
  const match = html.match(linkPattern);
  return match ? match[1] || match[0] : null;
};

/**
 * Extract a verification link from email HTML.
 * Convenience wrapper around extractLinkFromEmail for verification flows.
 *
 * @param html - The HTML content of the email
 * @returns The verification link URL, or null if not found
 */
export const extractVerificationLink = (html: string): string | null => {
  return extractLinkFromEmail(html, /href="(https?:\/\/[^\"]*verify-email[^\"]*)"/i);
};

/**
 * Extract the local app route path from a verification URL.
 * Example: https://localhost:8080/verify-email?token=abc -> /verify-email?token=abc
 */
export const extractVerificationPath = (verificationLink: string): string => {
  const parsedUrl = new URL(verificationLink);
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
};

/**
 * Read DISABLE_EMAIL_VERIFICATION from backend app config.
 * Intentionally uses direct import of app-level config constant (not env).
 */
export const isEmailVerificationDisabled = (): boolean => {
  return DISABLE_EMAIL_VERIFICATION;
};

/**
 * Read a verification link from a locally-saved email file.
 * When EMAIL_MODE is configured as local, the backend saves emails to
 * <starter-app-root>/temp/emails/ as HTML files
 * with metadata comments containing recipient info.
 *
 * Polls the local email directory until a matching file appears or the timeout expires.
 *
 * @param email - The recipient email address to search for
 * @param timeoutMs - Maximum time to wait for the file to appear (default: 30000)
 * @returns The verification link URL
 * @throws If no matching local email file is found within the timeout
 */
export const getVerificationLinkFromLocalEmail = async (email: string, timeoutMs = 30_000): Promise<string> => {
  const fs = await import('fs');

  const emailDir = path.join(STARTER_APP_ROOT, ...EMAIL_ARTIFACTS_RELATIVE_PATH);

  const POLL_INTERVAL_MS = 1_000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const files = fs
        .readdirSync(emailDir)
        .filter((f: string) => f.endsWith('.html'))
        .sort()
        .reverse(); // newest first

      for (const file of files) {
        const content = fs.readFileSync(path.join(emailDir, file), 'utf-8');
        // Local emails have a metadata comment with "To: {email}"
        if (content.includes(`To: ${email}`) || content.includes(email)) {
          const link = extractVerificationLink(content);
          if (link) return link;
        }
      }
    } catch {
      // Directory may not exist yet — backend creates it on first email send
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`No local verification email found for ${email} in directory: ${emailDir}`);
};

/**
 * Wait for a verification email and extract the verification link.
 * Reads from local email files saved by the backend
 * (<starter-app-root>/temp/emails/).
 *
 * @param email - The recipient email address
 * @param timeoutMs - Maximum time to wait for email (default: 30000)
 * @returns The verification link URL
 * @throws If email not received or link not found within the timeout
 */
export const waitForVerificationLink = async (email: string, timeoutMs = 30_000): Promise<string> => {
  return getVerificationLinkFromLocalEmail(email, timeoutMs);
};

/**
 * Open verify-email using the local app path extracted from local email HTML.
 * This keeps Playwright on the tested app origin even if email HTML uses a different host.
 */
export const followVerificationPathFromLocalEmail = async (
  page: Page,
  email: string,
  timeoutMs = 30_000,
): Promise<string> => {
  const verificationLink = await waitForVerificationLink(email, timeoutMs);
  const verificationPath = extractVerificationPath(verificationLink);
  await page.goto(verificationPath);
  return verificationPath;
};
