// Wix Headless connection configuration
// Site ID: 3af6b241-2f72-497c-bad6-8ab2369915ff
// Companion OAuth App ID: bd674216-0a4d-4728-a32b-26c8d700c209

export const WIX_SITE_ID = '3af6b241-2f72-497c-bad6-8ab2369915ff';

export const WIX_CLIENT_ID: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WIX_CLIENT_ID) ||
  'bd674216-0a4d-4728-a32b-26c8d700c209';
