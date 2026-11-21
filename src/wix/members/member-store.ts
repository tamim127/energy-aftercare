import { fetchCurrentMember } from './members';
import {
  loggedInHint,
  loginMember,
  registerMember,
  verifyMemberEmail,
  sendPasswordReset,
  logoutMember,
  CaptchaTokens,
} from './auth';
import type { CurrentMember, LoginResult, MemberState } from './types';

const INITIAL_STATE: MemberState = {
  member: null,
  loggedIn: false,
  loading: true,
  error: null,
};

let state: MemberState = INITIAL_STATE;
const listeners = new Set<() => void>();
let started = false;

function notify() {
  for (const listener of listeners) {
    try {
      listener();
    } catch (e) {
      console.error('Member listener error:', e);
    }
  }
}

export function getMemberState(): MemberState {
  return state;
}

export function setMemberState(patch: Partial<MemberState>): void {
  state = { ...state, ...patch };
  notify();
}

export function subscribeMember(listener: () => void): () => void {
  listeners.add(listener);

  if (!started && typeof window !== 'undefined') {
    started = true;
    void refreshMember();
  }

  return () => {
    listeners.delete(listener);
  };
}

export async function refreshMember(): Promise<void> {
  setMemberState({ loading: true, error: null });

  const hint = loggedInHint();
  if (!hint) {
    setMemberState({ member: null, loggedIn: false, loading: false });
    return;
  }

  const member = await fetchCurrentMember();
  setMemberState({
    member,
    loggedIn: member !== null || hint,
    loading: false,
  });
}

export async function login(
  email: string,
  password: string,
  captchaTokens?: CaptchaTokens
): Promise<LoginResult> {
  setMemberState({ loading: true, error: null });
  const result = await loginMember(email, password, captchaTokens);
  if (result.state === 'SUCCESS') {
    await refreshMember();
  } else {
    setMemberState({ loading: false, error: result.error || 'Login failed' });
  }
  return result;
}

export async function register(
  email: string,
  password: string,
  profile?: { firstName?: string; lastName?: string },
  captchaTokens?: CaptchaTokens
): Promise<LoginResult> {
  setMemberState({ loading: true, error: null });
  const result = await registerMember(email, password, profile, captchaTokens);
  if (result.state === 'SUCCESS') {
    await refreshMember();
  } else {
    setMemberState({ loading: false, error: result.error || 'Registration failed' });
  }
  return result;
}

export async function verifyEmail(code: string): Promise<LoginResult> {
  setMemberState({ loading: true, error: null });
  const result = await verifyMemberEmail(code);
  if (result.state === 'SUCCESS') {
    await refreshMember();
  } else {
    setMemberState({ loading: false, error: result.error || 'Verification failed' });
  }
  return result;
}

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  return sendPasswordReset(email);
}

export async function logout(): Promise<void> {
  setMemberState({ member: null, loggedIn: false, loading: false });
  await logoutMember();
}
