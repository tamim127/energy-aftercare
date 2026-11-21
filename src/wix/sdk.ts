// The official Wix SDK auth seam for Energy Aftercare Headless Frontend.
import { createClient, OAuthStrategy, EMPTY_TOKENS } from '@wix/sdk';
import type { IOAuthStrategy, TokenStorage, Tokens } from '@wix/sdk';
import { WIX_CLIENT_ID } from './config';

const STORAGE_KEY = `wix-session-${WIX_CLIENT_ID || 'default'}`;

function browserTokenStorage(): TokenStorage {
  return {
    getTokens(): Tokens {
      if (typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) return JSON.parse(raw) as Tokens;
        } catch {
          /* disabled/corrupt storage */
        }
      }
      return EMPTY_TOKENS;
    },
    setTokens(tokens: Tokens): void {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
      } catch {
        /* storage full */
      }
    },
  };
}

export const wixClient = createClient({
  auth: OAuthStrategy({
    clientId: WIX_CLIENT_ID,
    tokenStorage: browserTokenStorage(),
  }),
});

/**
 * Bind an SDK module to this app's authenticated client.
 */
export function wixModule<T>(module: T): T {
  return wixClient.use(module as unknown as Record<string, unknown>) as unknown as T;
}

/**
 * Authenticated fetch for Wix REST endpoints with visitor identity.
 */
export function wixFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith('http') ? path : `https://www.wixapis.com${path}`;
  return wixClient.fetchWithAuth(url, init);
}

export function wixAuth(): IOAuthStrategy {
  return wixClient.auth;
}
