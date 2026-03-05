import type { Page } from '@playwright/test';
import { waitForPageReady } from '../fixtures';
import { ROUTES } from './test-data';
import { followVerificationPathFromLocalEmail, isEmailVerificationDisabled } from './email';

interface AuthFlowLoginPage {
  register: (email: string, password: string) => Promise<void>;
  goto: () => Promise<void>;
  waitForReady: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

interface CompleteRegistrationAuthFlowParams {
  page: Page;
  loginPage: AuthFlowLoginPage;
  email: string;
  password: string;
  verificationEmailTimeoutMs?: number;
  dashboardRedirectTimeoutMs?: number;
}

interface CompleteRegistrationAuthFlowResult {
  verificationDisabled: boolean;
  verificationPath?: string;
  requiredManualLogin: boolean;
}

export const completeRegistrationAuthFlow = async (
  params: CompleteRegistrationAuthFlowParams,
): Promise<CompleteRegistrationAuthFlowResult> => {
  const {
    page,
    loginPage,
    email,
    password,
    verificationEmailTimeoutMs = 60_000,
    dashboardRedirectTimeoutMs = 30_000,
  } = params;

  const verificationDisabled = isEmailVerificationDisabled();

  await loginPage.register(email, password);

  if (verificationDisabled) {
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: dashboardRedirectTimeoutMs });
    await waitForPageReady(page);
    return {
      verificationDisabled,
      requiredManualLogin: false,
    };
  }

  const verificationPath = await followVerificationPathFromLocalEmail(page, email, verificationEmailTimeoutMs);
  await waitForPageReady(page);

  let requiredManualLogin = false;
  try {
    await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 10_000 });
  } catch {
    requiredManualLogin = true;
    await loginPage.goto();

    if (new URL(page.url()).pathname !== ROUTES.DASHBOARD) {
      await loginPage.waitForReady();
      await loginPage.login(email, password);
      await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: dashboardRedirectTimeoutMs });
    }
  }

  await waitForPageReady(page);

  return {
    verificationDisabled,
    verificationPath,
    requiredManualLogin,
  };
};
