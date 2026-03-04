import { render } from '@react-email/components';
import { EmailVerificationEmail } from './EmailVerificationEmail.js';
import { sendEmail } from '../mailgun.js';
import type { EmailResponse } from '../mailgun.js';

const APP_URL = process.env.APP_URL || `http://localhost:${process.env.PORT || '8080'}`;

export const sendVerificationEmail = async (to: string, token: string): Promise<EmailResponse> => {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;
  const html = await render(EmailVerificationEmail({ verificationUrl }), { pretty: false });

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html,
  });
};
