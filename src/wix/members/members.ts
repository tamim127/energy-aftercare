import { wixFetch, wixAuth } from '../sdk';
import type { CurrentMember } from './types';

/**
 * Reads the currently logged in member's profile from Wix Members API.
 * GET /members/v1/members/my?fieldsets=FULL
 */
export async function fetchCurrentMember(): Promise<CurrentMember | null> {
  try {
    const auth = wixAuth();
    if (!auth || !auth.loggedIn()) {
      return null;
    }

    const res = await wixFetch('/members/v1/members/my?fieldsets=FULL', {
      method: 'GET',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json().catch(() => null);
    const raw = data?.member;
    if (!raw || !(raw.id || raw._id)) {
      return null;
    }

    const firstName: string = raw.contact?.firstName || '';
    const lastName: string = raw.contact?.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const nickname: string = raw.profile?.nickname || '';
    const loginEmail: string = raw.loginEmail || raw.contact?.primaryEmail || '';
    const photoUrl: string = raw.profile?.photo?.url || '';
    const created = raw.createdDate || raw._createdDate;

    return {
      id: raw.id || raw._id,
      loginEmail,
      displayName: nickname || fullName || (loginEmail ? loginEmail.split('@')[0] : 'Member'),
      firstName,
      lastName,
      nickname,
      photoUrl,
      contactId: raw.contactId || '',
      memberSince: created ? new Date(created).toISOString().slice(0, 10) : '',
    };
  } catch (err) {
    console.error('Failed to fetch current member:', err);
    return null;
  }
}
