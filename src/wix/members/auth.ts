import { wixAuth, wixClient } from '../sdk';
import type { LoginResult, LoginState } from './types';

export interface CaptchaTokens {
  invisibleRecaptchaToken?: string;
  recaptchaToken?: string;
}

export function getCaptchaSiteKeys() {
  const auth = wixAuth();
  return {
    invisible: (auth as any).captchaInvisibleSiteKey || '6LdoPaUfAAAAAJphvHoUoOob7mx0KDlXyXlgrx5v',
    visible: (auth as any).captchaVisibleSiteKey || '6Ld0J8IcAAAAANyrnxzrRlX1xrrdXsOmsepUYosy',
  };
}

export async function ensureTokens(): Promise<void> {
  const currentTokens = wixClient.auth.getTokens();
  if (!currentTokens?.accessToken?.value) {
    try {
      const tokens = await wixClient.auth.generateVisitorTokens();
      wixClient.auth.setTokens(tokens);
    } catch (err) {
      console.warn('Could not generate visitor tokens:', err);
    }
  }
}

function parseWixError(error: unknown, errorCode?: string): string {
  if (errorCode === 'invalidPassword') return 'Incorrect password. Please try again.';
  if (errorCode === 'invalidEmail') return 'No account found with this email or invalid format.';
  if (errorCode === 'emailAlreadyExists') return 'An account with this email already exists. Please log in.';
  if (errorCode === 'resetPassword') return 'You need to reset your password before logging in.';
  if (errorCode === 'missingCaptchaToken') return 'Security verification required. Please try again.';

  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error);
      if (parsed.message?.includes('Identity not found')) {
        return 'No account found with this email address. Please sign up.';
      }
      if (parsed.message) return parsed.message;
    } catch {
      if (error.includes('Identity not found')) {
        return 'No account found with this email address. Please sign up.';
      }
      return error;
    }
  }
  return 'Authentication failed. Please check your details and try again.';
}

export function loggedInHint(): boolean {
  try {
    return wixAuth().loggedIn();
  } catch {
    return false;
  }
}

export async function loginMember(
  email: string,
  password: string,
  captchaTokens?: CaptchaTokens
): Promise<LoginResult> {
  await ensureTokens();
  const auth = wixAuth();
  try {
    const raw: any = await auth.login({
      email,
      password,
      ...(captchaTokens ? { captchaTokens } : {}),
    });
    const loginState: LoginState =
      raw?.loginState === 'SUCCESS'
        ? 'SUCCESS'
        : raw?.loginState === 'REQUIRE_EMAIL_VERIFICATION' || raw?.loginState === 'EMAIL_VERIFICATION_REQUIRED'
          ? 'EMAIL_VERIFICATION_REQUIRED'
          : raw?.loginState === 'REQUIRE_OWNER_APPROVAL' || raw?.loginState === 'OWNER_APPROVAL_REQUIRED'
            ? 'OWNER_APPROVAL_REQUIRED'
            : 'FAILURE';

    if (loginState === 'SUCCESS') {
      const sessionToken = raw?.data?.sessionToken || raw?.sessionToken;
      if (sessionToken) {
        const tokens = await auth.getMemberTokensForDirectLogin(sessionToken);
        auth.setTokens(tokens);
      }
      return { state: 'SUCCESS' };
    }

    if (loginState === 'EMAIL_VERIFICATION_REQUIRED' || loginState === 'OWNER_APPROVAL_REQUIRED') {
      return { state: loginState, stateToken: raw?.data?.stateToken || raw?.stateToken };
    }

    const errMessage = parseWixError(raw?.error, raw?.errorCode);
    return {
      state: 'FAILURE',
      errorCode: raw?.errorCode,
      error: errMessage,
    };
  } catch (err: any) {
    return {
      state: 'FAILURE',
      error: parseWixError(err?.message || err),
    };
  }
}

export async function registerMember(
  email: string,
  password: string,
  profile?: { firstName?: string; lastName?: string },
  captchaTokens?: CaptchaTokens
): Promise<LoginResult> {
  await ensureTokens();
  const auth = wixAuth();
  try {
    const raw: any = await auth.register({
      email,
      password,
      ...(profile ? { profile } : {}),
      ...(captchaTokens ? { captchaTokens } : {}),
    });

    const loginState: LoginState =
      raw?.loginState === 'SUCCESS'
        ? 'SUCCESS'
        : raw?.loginState === 'REQUIRE_EMAIL_VERIFICATION' || raw?.loginState === 'EMAIL_VERIFICATION_REQUIRED'
          ? 'EMAIL_VERIFICATION_REQUIRED'
          : raw?.loginState === 'REQUIRE_OWNER_APPROVAL' || raw?.loginState === 'OWNER_APPROVAL_REQUIRED'
            ? 'OWNER_APPROVAL_REQUIRED'
            : 'FAILURE';

    if (loginState === 'SUCCESS') {
      const sessionToken = raw?.data?.sessionToken || raw?.sessionToken;
      if (sessionToken) {
        const tokens = await auth.getMemberTokensForDirectLogin(sessionToken);
        auth.setTokens(tokens);
      }
      return { state: 'SUCCESS' };
    }

    if (loginState === 'EMAIL_VERIFICATION_REQUIRED' || loginState === 'OWNER_APPROVAL_REQUIRED') {
      return { state: loginState, stateToken: raw?.data?.stateToken || raw?.stateToken };
    }

    const errMessage = parseWixError(raw?.error, raw?.errorCode);
    return {
      state: 'FAILURE',
      errorCode: raw?.errorCode,
      error: errMessage,
    };
  } catch (err: any) {
    return {
      state: 'FAILURE',
      error: parseWixError(err?.message || err),
    };
  }
}

export async function verifyMemberEmail(verificationCode: string): Promise<LoginResult> {
  await ensureTokens();
  const auth = wixAuth();
  try {
    const raw: any = await auth.processVerification({ verificationCode });
    if (raw?.loginState === 'SUCCESS') {
      const sessionToken = raw?.data?.sessionToken || raw?.sessionToken;
      if (sessionToken) {
        const tokens = await auth.getMemberTokensForDirectLogin(sessionToken);
        auth.setTokens(tokens);
      }
      return { state: 'SUCCESS' };
    }
    return {
      state: 'FAILURE',
      error: raw?.error || 'Verification code did not match or has expired.',
    };
  } catch (err: any) {
    return {
      state: 'FAILURE',
      error: err?.message || 'Verification failed. Please try again.',
    };
  }
}

export async function sendPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  await ensureTokens();
  const auth = wixAuth();
  try {
    const redirectUri = typeof window !== 'undefined' ? window.location.origin : 'https://energyaftercare.co.uk';
    await auth.sendPasswordResetEmail(email, redirectUri);
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: parseWixError(err?.message || err),
    };
  }
}

export async function logoutMember(): Promise<void> {
  const auth = wixAuth();
  try {
    if (typeof window !== 'undefined') {
      const redirectUri = window.location.origin;
      const { logoutUrl } = await auth.logout(redirectUri);
      if (logoutUrl) {
        window.location.assign(logoutUrl);
        return;
      }
    }
  } catch {
    // fallback local storage clear
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('wix-session-bd674216-0a4d-4728-a32b-26c8d700c209');
      window.location.reload();
    }
  }
}
