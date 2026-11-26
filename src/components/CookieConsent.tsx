import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'ea_cookie_consent';

export type CookieChoice = 'all' | 'essential' | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<CookieChoice | 'dismissed' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!stored) {
        // Small delay so it smoothly slides in on initial visit
        const timer = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(timer);
      }
      setConsent(stored as CookieChoice);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    } catch {
      // storage unavailable
    }
    setConsent(choice);
    setVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'essential');
    } catch {
      // storage unavailable
    }
    setConsent('essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Cookie consent banner"
        role="dialog"
        aria-modal="false"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl sm:bottom-6 sm:left-6 sm:right-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-ea-green/30 bg-ea-black/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-ea-green/10 blur-3xl" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Text description */}
            <div className="flex items-start gap-3.5 pr-6 sm:pr-8 md:pr-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ea-green/10 text-ea-green border border-ea-green/20">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="text-xs sm:text-sm text-ea-white/85 leading-relaxed">
                <p className="font-bold text-ea-white flex items-center gap-1.5 mb-1">
                  We respect your privacy <ShieldCheck className="h-4 w-4 text-ea-green inline" />
                </p>
                <p>
                  We use essential cookies to ensure our website, online bookings, and solar calculators operate smoothly. With your permission, we also use analytical cookies to help us improve your experience. Read our full{' '}
                  <Link
                    to="/cookie-policy"
                    className="font-semibold text-ea-green underline underline-offset-2 hover:text-ea-green/80 transition-colors"
                  >
                    Cookie Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy-policy"
                    className="font-semibold text-ea-green underline underline-offset-2 hover:text-ea-green/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => handleChoice('essential')}
                className="rounded-xl border border-ea-grey/30 bg-ea-ink px-3.5 py-2 text-xs font-semibold text-ea-white/80 hover:bg-ea-grey/20 hover:text-ea-white transition-all focus:outline-none focus:ring-2 focus:ring-ea-green/40"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => handleChoice('all')}
                className="rounded-xl bg-ea-green px-4 py-2 text-xs font-bold text-ea-black hover:bg-ea-green/90 transition-all shadow-md shadow-ea-green/20 focus:outline-none focus:ring-2 focus:ring-ea-green/40"
              >
                Accept All Cookies
              </button>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close cookie banner"
            className="absolute right-3 top-3 text-ea-grey/60 hover:text-ea-white transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
