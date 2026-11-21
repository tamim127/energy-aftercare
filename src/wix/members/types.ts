// Members DTOs and Authentication Types for Energy Aftercare

export interface CurrentMember {
  id: string;
  loginEmail: string;
  displayName: string;
  firstName: string;
  lastName: string;
  nickname: string;
  photoUrl: string;
  contactId: string;
  memberSince: string;
}

export type LoginState =
  | 'SUCCESS'
  | 'EMAIL_VERIFICATION_REQUIRED'
  | 'OWNER_APPROVAL_REQUIRED'
  | 'FAILURE';

export interface LoginResult {
  state: LoginState;
  stateToken?: string;
  errorCode?: string;
  error?: string;
}

export interface MemberState {
  member: CurrentMember | null;
  loggedIn: boolean;
  loading: boolean;
  error: string | null;
}
