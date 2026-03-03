// ============================================================================
// Email Testing Helpers — Local File Reader
// ============================================================================

/**
 * Generate a unique test email address for registration.
 * Format: e2e-test-{timestamp}@test.local
 */
export const generateTestEmail = (): string => {
  return `e2e-test-${Date.now()}@test.local`;
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
 * const link = extractLinkFromEmail(html, /href="(https?:\/\/[^"]*verify-email[^"]*)"/i);
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
  return extractLinkFromEmail(html, /href="(https?:\/\/[^"]*verify-email[^"]*)"/i);
};

/**
 * Read a verification link from a locally-saved email file.
 * When EMAIL_MODE=local, the backend saves emails to temp/emails/ as HTML files
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
  const path = await import('path');

  // Backend saves emails relative to its own cwd — check both possible locations
  const possibleDirs = [
    path.join(process.cwd(), 'backend', 'temp', 'emails'),
    path.join(process.cwd(), 'temp', 'emails'),
  ];

  const POLL_INTERVAL_MS = 1_000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    for (const emailDir of possibleDirs) {
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
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`No local verification email found for ${email} in directories: ${possibleDirs.join(', ')}`);
};

/**
 * Wait for a verification email and extract the verification link.
 * Reads from local email files saved by the backend (temp/emails/).
 *
 * @param email - The recipient email address
 * @param timeoutMs - Maximum time to wait for email (default: 30000)
 * @returns The verification link URL
 * @throws If email not received or link not found within the timeout
 */
export const waitForVerificationLink = async (email: string, timeoutMs = 30_000): Promise<string> => {
  return getVerificationLinkFromLocalEmail(email, timeoutMs);
};
