/**
 * Email Service — Mailgun Integration with Local Development Mode
 *
 * Environment Variables:
 * - EMAIL_MODE: Controls email sending behavior
 *   - "local" (default): Save emails as HTML files to temp/emails/ (development/testing)
 *   - "mailgun": Send emails via Mailgun API (production)
 *
 * When EMAIL_MODE=local:
 * - Emails are saved to temp/emails/ with timestamp and subject in filename
 * - Email metadata (to, from, subject) is included as HTML comment
 * - No Mailgun API keys required
 *
 * When EMAIL_MODE=mailgun:
 * - Emails are sent via Mailgun API
 * - Requires: MAILGUN_API_KEY, MAILGUN_URL, MAILGUN_DOMAIN, MAILGUN_SENDER
 */

import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EMAIL_MODE, MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_SENDER, MAILGUN_URL } from '@/src/config/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Project root — 3 levels up from backend/src/services/mailgun/ */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let mailgunClient: ReturnType<Mailgun['client']> | null = null;

const getMailgunClient = (): ReturnType<Mailgun['client']> | null => {
  if (!MAILGUN_API_KEY) return null;

  if (!mailgunClient) {
    const mailgun = new Mailgun(FormData);
    mailgunClient = mailgun.client({
      username: 'api',
      url: MAILGUN_URL,
      key: MAILGUN_API_KEY,
    });
  }

  return mailgunClient;
};

/**
 * Save email HTML to local temp folder for development/testing.
 * Files are saved to temp/emails/ relative to the project root.
 */
const sendViaLocalFile = async ({ to, subject, html }: SendEmailOptions): Promise<EmailResponse> => {
  try {
    const tempDir = path.join(PROJECT_ROOT, 'temp', 'emails');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedSubject = subject.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${sanitizedSubject}-${timestamp}.html`;
    const filePath = path.join(tempDir, filename);

    const metadata = `<!--
EMAIL METADATA (Development Mode)
To: ${to}
From: ${MAILGUN_SENDER}
Subject: ${subject}
Generated: ${new Date().toISOString()}
-->

`;

    fs.writeFileSync(filePath, metadata + html, 'utf-8');

    console.log(`📧 [LOCAL MODE] Email saved to: ${filePath}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);

    return { success: true, messageId: `local-${timestamp}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Local file save error:', message);
    return { success: false, error: message || 'Failed to save email to local file' };
  }
};

/**
 * Send email via Mailgun API.
 */
const sendViaMailgun = async ({ to, subject, html }: SendEmailOptions): Promise<EmailResponse> => {
  const client = getMailgunClient();

  if (!client) {
    return { success: false, error: 'Mailgun is not configured — missing MAILGUN_API_KEY' };
  }

  try {
    const result = await client.messages.create(MAILGUN_DOMAIN, {
      from: MAILGUN_SENDER,
      to,
      subject,
      html,
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Mailgun error:', message);
    return { success: false, error: message || 'Failed to send email via Mailgun' };
  }
};

/**
 * Send an email using the configured mode (local file or Mailgun API).
 *
 * In local mode, saves an HTML file to <project-root>/temp/emails/ for easy inspection.
 * In mailgun mode, sends via the Mailgun API.
 */
export const sendEmail = async (options: SendEmailOptions): Promise<EmailResponse> => {
  if (EMAIL_MODE === 'local') {
    return sendViaLocalFile(options);
  }

  return sendViaMailgun(options);
};
