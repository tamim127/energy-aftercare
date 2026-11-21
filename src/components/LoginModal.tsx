import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';
import { cn } from '@project/components/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@project/components/ui/dialog';
import { FormField } from './FormField';
import { LogoMark } from './Logo';
import { useMember } from '../hooks/useMember';
import { getCaptchaSiteKeys } from '../wix/members/auth';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify' | 'pending';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { login, register, verifyEmail, requestPasswordReset } = useMember();

  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const captchaRef = useRef<ReCAPTCHA>(null);
  const [showVisibleCaptcha, setShowVisibleCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { invisible: invisibleSiteKey, visible: visibleSiteKey } = getCaptchaSiteKeys();

  // Reset state when modal opens or closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setMode('login');
        setFormErrors({});
        setApiError(null);
        setSuccessMsg(null);
        setShowVisibleCaptcha(false);
        setCaptchaToken(null);
        captchaRef.current?.reset();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          verificationCode: '',
        });
      }, 200);
    }
  }, [open]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (apiError) setApiError(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setFormErrors({});
    setApiError(null);
    setSuccessMsg(null);
    setShowVisibleCaptcha(false);
    setCaptchaToken(null);
    captchaRef.current?.reset();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setFormErrors(
        Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]))
      );
      return;
    }

    setBusy(true);
    setApiError(null);

    try {
      let tokens: { invisibleRecaptchaToken?: string; recaptchaToken?: string } | undefined;
      if (showVisibleCaptcha && captchaToken) {
        tokens = { recaptchaToken: captchaToken };
      }

      const authRes = await login(formData.email, formData.password, tokens);
      if (authRes.state === 'SUCCESS') {
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onOpenChange(false);
        }, 900);
      } else if (authRes.state === 'EMAIL_VERIFICATION_REQUIRED') {
        setMode('verify');
      } else if (authRes.state === 'OWNER_APPROVAL_REQUIRED') {
        setMode('pending');
      } else {
        if (
          authRes.errorCode === 'missingCaptchaToken' ||
          authRes.errorCode === 'invalidCaptchaToken' ||
          authRes.error?.toLowerCase().includes('verification required')
        ) {
          setShowVisibleCaptcha(true);
          setCaptchaToken(null);
          captchaRef.current?.reset();
        }
        setApiError(authRes.error || 'Failed to sign in. Please verify your email and password.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

    const errors: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
    }

    if (!captchaToken) {
      errors.captcha = 'Please check the "I\'m not a robot" box';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBusy(true);
    setApiError(null);

    try {
      const authRes = await register(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        { recaptchaToken: captchaToken }
      );

      if (authRes.state === 'SUCCESS') {
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onOpenChange(false);
        }, 1200);
      } else if (authRes.state === 'EMAIL_VERIFICATION_REQUIRED') {
        setMode('verify');
      } else if (authRes.state === 'OWNER_APPROVAL_REQUIRED') {
        setMode('pending');
      } else {
        if (
          authRes.errorCode === 'missingCaptchaToken' ||
          authRes.errorCode === 'invalidCaptchaToken'
        ) {
          setCaptchaToken(null);
          captchaRef.current?.reset();
        }
        setApiError(authRes.error || 'Registration failed. Please check your information.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode.trim()) {
      setFormErrors({ verificationCode: 'Verification code is required' });
      return;
    }

    setBusy(true);
    setApiError(null);

    try {
      const authRes = await verifyEmail(formData.verificationCode.trim());
      if (authRes.state === 'SUCCESS') {
        setSuccessMsg('Email verified successfully!');
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      } else {
        setApiError(authRes.error || 'Verification code did not match.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotSchema.safeParse({ email: formData.email });

    if (!result.success) {
      setFormErrors(
        Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]))
      );
      return;
    }

    setBusy(true);
    setApiError(null);

    try {
      const res = await requestPasswordReset(formData.email);
      if (res.ok) {
        setSuccessMsg('Password reset instructions have been sent to your email.');
      } else {
        setApiError(res.error || 'Could not send reset email. Check if the address is correct.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Password reset request failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md rounded-3xl border border-ea-grey/30 bg-ea-black text-ea-white shadow-2xl backdrop-blur-xl no-scrollbar",
          mode === 'register' ? "p-5 sm:p-6 max-h-[96vh]" : "p-8 max-h-[90vh]"
        )}
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <LogoMark className={mode === 'register' ? "h-8 w-auto text-ea-green" : "h-10 w-auto text-ea-green"} />
          <DialogTitle className={cn("font-bold tracking-tight text-ea-white", mode === 'register' ? "mt-2 text-xl" : "mt-4 text-2xl")}>
            {mode === 'login' && 'Log In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'verify' && 'Verify Email'}
            {mode === 'pending' && 'Account Pending'}
          </DialogTitle>
          <DialogDescription className={cn("text-ea-grey", mode === 'register' ? "mt-0.5 text-xs" : "mt-1 text-sm")}>
            {mode === 'login' && 'Access your Energy Aftercare portal and diagnostic tools.'}
            {mode === 'register' && 'Sign up to register your systems and contact support.'}
            {mode === 'forgot' && 'Enter your email to receive a secure password recovery link.'}
            {mode === 'verify' && 'Enter the verification code sent to your email.'}
            {mode === 'pending' && 'Your registration is awaiting approval.'}
          </DialogDescription>
        </div>

        {/* Success Message Banner */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-ea-green/30 bg-ea-green/10 p-3.5 text-sm text-ea-green">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Message Banner */}
        {apiError && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* 1. LOG IN VIEW */}
        {mode === 'login' && !successMsg && (
          <form onSubmit={handleLogin} noValidate className="mt-5 space-y-4">
            <FormField
              id="login-email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              error={formErrors.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={busy}
            />

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-ea-white">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="mb-2 text-xs font-medium text-ea-green hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                disabled={busy}
                className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-ea-green focus:ring-2 focus:ring-ea-green/40 border-ea-grey/40 bg-ea-ink2 text-ea-white ${
                  formErrors.password ? 'border-red-500' : ''
                }`}
              />
              {formErrors.password && (
                <p className="mt-1.5 text-sm text-red-400">{formErrors.password}</p>
              )}
            </div>

            {/* Fallback visible reCAPTCHA if login security check triggered */}
            {showVisibleCaptcha && (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-ea-ink2 border border-ea-green/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-ea-green font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Security verification</span>
                </div>
                <ReCAPTCHA
                  ref={captchaRef}
                  size="normal"
                  theme="dark"
                  sitekey={visibleSiteKey}
                  onChange={(tok) => setCaptchaToken(tok)}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ea-green py-3.5 text-base font-bold text-ea-black transition-all hover:bg-ea-green/90 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Logging in…
                </>
              ) : (
                'Log In'
              )}
            </button>

            <div className="pt-2 text-center text-sm text-ea-grey">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-ea-green hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION / SIGN UP VIEW */}
        {mode === 'register' && !successMsg && (
          <form onSubmit={handleRegister} noValidate className="mt-4 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <FormField
                id="reg-first-name"
                label="First name"
                placeholder="John"
                value={formData.firstName}
                error={formErrors.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                disabled={busy}
              />
              <FormField
                id="reg-last-name"
                label="Last name"
                placeholder="Doe"
                value={formData.lastName}
                error={formErrors.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                disabled={busy}
              />
            </div>

            <FormField
              id="reg-email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              error={formErrors.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={busy}
            />

            <FormField
              id="reg-password"
              label="Password (min 6 characters)"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              error={formErrors.password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={busy}
            />

            <FormField
              id="reg-confirm-password"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              error={formErrors.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              disabled={busy}
            />

            <p className="text-[11px] leading-tight text-ea-grey/80">
              By creating an account, your contact profile is saved in Energy Aftercare CRM for fast support and technical assistance.
            </p>

            {/* Always-visible reCAPTCHA on Registration Form */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-ea-ink2 border border-ea-green/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-ea-green font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Security verification</span>
              </div>
              <ReCAPTCHA
                ref={captchaRef}
                size="normal"
                theme="dark"
                sitekey={visibleSiteKey}
                onChange={(tok) => {
                  setCaptchaToken(tok);
                  if (formErrors.captcha) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.captcha;
                      return next;
                    });
                  }
                  if (apiError) setApiError(null);
                }}
                onExpired={() => setCaptchaToken(null)}
              />
              {formErrors.captcha && (
                <p className="text-xs text-red-400 font-medium text-center">{formErrors.captcha}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-ea-green py-3 text-base font-bold text-ea-black transition-all hover:bg-ea-green/90 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="pt-1 text-center text-sm text-ea-grey">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-ea-green hover:underline focus:outline-none"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} noValidate className="mt-5 space-y-4">
            <FormField
              id="forgot-email"
              label="Registered Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              error={formErrors.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={busy}
            />

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ea-green py-3.5 text-base font-bold text-ea-black transition-all hover:bg-ea-green/90 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending link…
                </>
              ) : (
                'Send Recovery Link'
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ea-grey hover:text-ea-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Log In
              </button>
            </div>
          </form>
        )}

        {/* 4. EMAIL VERIFICATION CODE VIEW */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} noValidate className="mt-5 space-y-4">
            <FormField
              id="verify-code"
              label="Verification Code"
              type="text"
              placeholder="123456"
              value={formData.verificationCode}
              error={formErrors.verificationCode}
              onChange={(e) => updateField('verificationCode', e.target.value)}
              disabled={busy}
            />

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ea-green py-3.5 text-base font-bold text-ea-black transition-all hover:bg-ea-green/90 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying…
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ea-grey hover:text-ea-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Log In
              </button>
            </div>
          </form>
        )}

        {/* 5. OWNER APPROVAL PENDING VIEW */}
        {mode === 'pending' && (
          <div className="mt-5 space-y-4 text-center">
            <p className="rounded-xl border border-ea-grey/30 bg-ea-ink2 p-4 text-sm text-ea-grey">
              Your account registration has been submitted and is awaiting owner approval in Wix CRM. You will receive an email once your account has been approved.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full bg-ea-grey/30 py-3 text-sm font-semibold text-ea-white hover:bg-ea-grey/50"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
