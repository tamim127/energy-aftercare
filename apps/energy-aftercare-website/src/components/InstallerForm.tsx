import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { installerContent } from '../content/installer';
import { FormField, TextAreaField, CheckField } from './FormField';
import { btn } from './ui';

const f = installerContent.form.fields;
const schema = z.object({
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,}$/, 'Enter a valid phone number'),
  company: z.string().trim().min(1, 'Required'),
  position: z.string().optional(),
  more: z.string().optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
});
type Values = z.infer<typeof schema>;

export default function InstallerForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<Values>({ resolver: zodResolver(schema) });

  if (isSubmitSuccessful)
    return (
      <div className="flex flex-col items-center rounded-3xl border border-ea-green/50 bg-ea-ink p-12 text-center" role="status">
        <CheckCircle2 className="h-14 w-14 text-ea-green" />
        <p className="mt-4 text-xl font-bold">Thanks for submitting!</p>
        <button onClick={() => reset()} className={`${btn.outlineDark} mt-6`}>{installerContent.form.heading}</button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(() => undefined)} noValidate className="space-y-5 rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="i-first" label={f.firstName} required autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <FormField id="i-last" label={f.lastName} required autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        <FormField id="i-email" label={f.email} type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField id="i-phone" label={f.phone} type="tel" required autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
        <FormField id="i-company" label={f.company} required autoComplete="organization" error={errors.company?.message} {...register('company')} />
        <FormField id="i-position" label={f.position} autoComplete="organization-title" {...register('position')} />
      </div>
      <TextAreaField id="i-more" label={f.more} {...register('more')} />
      <CheckField id="i-privacy" error={errors.privacy?.message} {...register('privacy')}>
        <Link to="/privacy-policy" className="text-ea-green underline">{f.privacy}</Link><span className="text-ea-green"> *</span>
      </CheckField>
      <button type="submit" className={`${btn.primary} w-full sm:w-auto sm:px-12`}>{installerContent.form.submit}</button>
    </form>
  );
}
