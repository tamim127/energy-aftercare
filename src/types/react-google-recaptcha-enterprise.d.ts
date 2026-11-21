declare module 'react-google-recaptcha-enterprise' {
  import * as React from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    size?: 'compact' | 'normal' | 'invisible';
    theme?: 'dark' | 'light';
    type?: 'image' | 'audio';
    tabindex?: number;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    hl?: string;
    stoken?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    execute(): void;
    executeAsync(): Promise<string | null>;
    reset(): void;
    forceReset(): void;
    getValue(): string | null;
    getWidgetId(): number | null;
  }
}
