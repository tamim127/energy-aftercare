import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { homeContent } from '../content/home';
import { FormField, TextAreaField, CheckField } from './FormField';
import { btn } from './ui';

const f = homeContent.contact.fields;
const schema = z.object({
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  message: z.string().trim().min(1, 'Required'),
  terms: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
});
type Values = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<Values>({ resolver: zodResolver(schema) });

  if (isSubmitSuccessful)
    return (
      <div className="flex flex-col items-center rounded-2xl border border-ea-green/50 bg-ea-ink p-12 text-center" role="status">
        <CheckCircle2 className="h-14 w-14 text-ea-green" />
        <p className="mt-4 text-xl font-bold">Thanks for submitting!</p>
        <button onClick={() => reset()} className={`${btn.outlineDark} mt-6`}>{homeContent.contact.heading}</button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(() => undefined)} noValidate className="space-y-5 rounded-2xl border border-ea-grey/25 bg-ea-ink p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-first" label={f.firstName} required autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <FormField id="c-last" label={f.lastName} required autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <FormField id="c-email" label={f.email} type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
      <TextAreaField id="c-msg" label={f.message} required error={errors.message?.message} {...register('message')} />
      <CheckField id="c-terms" error={errors.terms?.message} {...register('terms')}>
        By submitting you agree to our <Link to="/terms-conditions" className="text-ea-green underline">Terms &amp; Conditions</Link>
        <span className="text-ea-green">*</span>
      </CheckField>
      <button type="submit" className={`${btn.primary} w-full sm:w-auto sm:px-10`}>{homeContent.contact.submit}</button>
    </form>
  );
}
