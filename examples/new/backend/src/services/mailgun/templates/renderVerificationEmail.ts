import { render } from '@react-email/components';
import { EmailVerificationEmail } from './EmailVerificationEmail.js';
import { sendEmail } from '../mailgun.js';
import type { EmailResponse } from '../mailgun.js';
import { APP_URL } from '@/src/config/env.js';

export const sendVerificationEmail = async (to: string, token: string): Promise<EmailResponse> => {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;
  const html = await render(EmailVerificationEmail({ verificationUrl }), { pretty: false });

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html,
  });
};
