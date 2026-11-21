import { useSyncExternalStore } from 'react';
import {
  getMemberState,
  subscribeMember,
  login,
  register,
  verifyEmail,
  requestPasswordReset,
  logout,
  refreshMember,
} from '../wix/members/member-store';
import type { CurrentMember, LoginResult, MemberState } from '../wix/members/types';
import type { CaptchaTokens } from '../wix/members/auth';

export interface UseMember extends MemberState {
  member: CurrentMember | null;
  loggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, captchaTokens?: CaptchaTokens) => Promise<LoginResult>;
  register: (
    email: string,
    password: string,
    profile?: { firstName?: string; lastName?: string },
    captchaTokens?: CaptchaTokens
  ) => Promise<LoginResult>;
  verifyEmail: (code: string) => Promise<LoginResult>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMember(): UseMember {
  const state = useSyncExternalStore(
    subscribeMember,
    getMemberState,
    getMemberState
  );

  return {
    ...state,
    login,
    register,
    verifyEmail,
    requestPasswordReset,
    logout,
    refresh: refreshMember,
  };
}
