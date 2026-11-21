import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { homeContent } from '../content/home';
import { FormField, TextAreaField, CheckField } from './FormField';
import { btn } from './ui';
import { submitInquiry } from '../wix/submissions';

const f = homeContent.contact.fields;
const schema = z.object({
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  message: z.string().trim().min(1, 'Required'),
  terms: z.boolean().refine((val) => val === true, { message: 'Required' }),
});
type Values = z.infer<typeof schema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Values) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await submitInquiry({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        message: data.message,
        type: 'Contact',
        subject: 'Website Contact Form Inquiry',
      });

      if (res.success) {
        setIsSubmitted(true);
        reset();
      } else {
        setSubmitError(res.error || 'Failed to send your message. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="flex flex-col items-center rounded-2xl border border-ea-green/50 bg-ea-ink p-12 text-center"
        role="status"
      >
        <CheckCircle2 className="h-14 w-14 text-ea-green" />
        <p className="mt-4 text-xl font-bold text-ea-white">Thanks for contacting us!</p>
        <p className="mt-2 text-sm text-ea-white/80 max-w-sm">
          Your inquiry has been received and securely synced to our system. An Energy Aftercare specialist will get back to you shortly.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className={`${btn.outlineDark} mt-6`}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-ea-grey/25 bg-ea-ink p-6 sm:p-8"
    >
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="c-first"
          label={f.firstName}
          required
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          id="c-last"
          label={f.lastName}
          required
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <FormField
        id="c-email"
        label={f.email}
        type="email"
        required
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextAreaField
        id="c-msg"
        label={f.message}
        required
        error={errors.message?.message}
        {...register('message')}
      />
      <CheckField id="c-terms" error={errors.terms?.message} {...register('terms')}>
        By submitting you agree to our{' '}
        <Link to="/terms-conditions" className="text-ea-green underline">
          Terms &amp; Conditions
        </Link>
        <span className="text-ea-green">*</span>
      </CheckField>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${btn.primary} w-full sm:w-auto sm:px-10 flex items-center justify-center gap-2 disabled:opacity-60`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-ea-black" />
            <span>Sending...</span>
          </>
        ) : (
          homeContent.contact.submit
        )}
      </button>
    </form>
  );
}
