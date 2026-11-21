/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WIX_CLIENT_ID?: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
