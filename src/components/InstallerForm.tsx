import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { installerContent } from '../content/installer';
import { FormField, TextAreaField, CheckField } from './FormField';
import { btn } from './ui';
import { submitInquiry } from '../wix/submissions';

const f = installerContent.form.fields;
const schema = z.object({
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,}$/, 'Enter a valid phone number'),
  company: z.string().trim().min(1, 'Required'),
  position: z.string().optional(),
  more: z.string().optional(),
  privacy: z.boolean().refine((val) => val === true, { message: 'Required' }),
});
type Values = z.infer<typeof schema>;

export default function InstallerForm() {
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
        phone: data.phone,
        type: 'Installer',
        subject: `Approved Installer Application: ${data.company}`,
        message: `Company: ${data.company}\nPosition: ${data.position || 'N/A'}\nNotes: ${data.more || 'None'}`,
        details: {
          company: data.company,
          position: data.position || '',
          notes: data.more || '',
        },
      });

      if (res.success) {
        setIsSubmitted(true);
        reset();
      } else {
        setSubmitError(res.error || 'Failed to submit application. Please try again.');
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
        className="flex flex-col items-center rounded-3xl border border-ea-green/50 bg-ea-ink p-12 text-center"
        role="status"
      >
        <CheckCircle2 className="h-14 w-14 text-ea-green" />
        <p className="mt-4 text-xl font-bold text-ea-white">Application Received!</p>
        <p className="mt-2 text-sm text-ea-white/80 max-w-sm">
          Thank you for applying to the Energy Aftercare Approved Installer Network. Our engineering verification team will review your credentials and contact you within 1-2 business days.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className={`${btn.outlineDark} mt-6`}
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 sm:p-10"
    >
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="i-first"
          label={f.firstName}
          required
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          id="i-last"
          label={f.lastName}
          required
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <FormField
          id="i-email"
          label={f.email}
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          id="i-phone"
          label={f.phone}
          type="tel"
          required
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <FormField
          id="i-company"
          label={f.company}
          required
          autoComplete="organization"
          error={errors.company?.message}
          {...register('company')}
        />
        <FormField
          id="i-position"
          label={f.position}
          autoComplete="organization-title"
          {...register('position')}
        />
      </div>
      <TextAreaField id="i-more" label={f.more} {...register('more')} />
      <CheckField id="i-privacy" error={errors.privacy?.message} {...register('privacy')}>
        <Link to="/privacy-policy" className="text-ea-green underline">
          {f.privacy}
        </Link>
        <span className="text-ea-green"> *</span>
      </CheckField>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${btn.primary} w-full sm:w-auto sm:px-12 flex items-center justify-center gap-2 disabled:opacity-60`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-ea-black" />
            <span>Submitting...</span>
          </>
        ) : (
          installerContent.form.submit
        )}
      </button>
    </form>
  );
}
