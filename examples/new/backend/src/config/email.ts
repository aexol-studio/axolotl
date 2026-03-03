/**
 * Email & verification configuration.
 *
 * These are APPLICATION SETTINGS — hardcoded, same for all environments.
 * Only secrets (API keys) come from process.env.
 * APP_URL and PORT live in the server entry point, not here.
 *
 * To change behavior for local development, edit these values directly.
 */

/** Set to true to skip email verification for new users. */
export const DISABLE_EMAIL_VERIFICATION = true;

/**
 * Email delivery mode:
 * - 'local': saves HTML files to temp/emails/ (for development)
 * - 'mailgun': sends via Mailgun API (for production)
 */
type EmailModeType = 'local' | 'mailgun';

export const EMAIL_MODE: EmailModeType = 'local';

/** Mailgun API base URL (EU region). */
export const MAILGUN_URL = 'https://api.eu.mailgun.net';

/** Mailgun sending domain. */
export const MAILGUN_DOMAIN = '';

/** Mailgun sender address (From: header). */
export const MAILGUN_SENDER = '';

// --- Secrets (from environment) ---

/** Mailgun API key — secret, must be in .env for production. */
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
