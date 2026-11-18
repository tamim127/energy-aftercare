import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@project/components/lib/utils';

const fieldCls = (dark: boolean, err?: string) =>
  cn(
    'w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-ea-green focus:ring-2 focus:ring-ea-green/40',
    dark ? 'border-ea-grey/40 bg-ea-ink2 text-ea-white' : 'border-ea-black/30 bg-ea-white text-ea-black',
    err && 'border-red-500',
  );

interface Base {
  label: string;
  error?: string;
  required?: boolean;
  dark?: boolean;
}

function Label({ id, label, required, dark }: Base & { id: string }) {
  return (
    <label htmlFor={id} className={cn('mb-2 block text-sm font-semibold', dark ? 'text-ea-white' : 'text-ea-black')}>
      {label}
      {required && <span className={dark ? 'text-ea-green' : ''}> *</span>}
    </label>
  );
}

function Err({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-red-400">
      {error}
    </p>
  );
}

export const FormField = forwardRef<HTMLInputElement, Base & InputHTMLAttributes<HTMLInputElement> & { id: string }>(
  ({ label, error, required, dark = true, id, ...rest }, ref) => (
    <div>
      <Label id={id} label={label} required={required} dark={dark} />
      <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={fieldCls(dark, error)} {...rest} />
      <Err id={id} error={error} />
    </div>
  ),
);
FormField.displayName = 'FormField';

export const TextAreaField = forwardRef<HTMLTextAreaElement, Base & TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }>(
  ({ label, error, required, dark = true, id, ...rest }, ref) => (
    <div>
      <Label id={id} label={label} required={required} dark={dark} />
      <textarea ref={ref} id={id} rows={5} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={fieldCls(dark, error)} {...rest} />
      <Err id={id} error={error} />
    </div>
  ),
);
TextAreaField.displayName = 'TextAreaField';

export const CheckField = forwardRef<HTMLInputElement, { id: string; error?: string; children: React.ReactNode } & InputHTMLAttributes<HTMLInputElement>>(
  ({ id, error, children, ...rest }, ref) => (
    <div>
      <div className="flex items-start gap-3">
        <input ref={ref} id={id} type="checkbox" aria-invalid={!!error} className="mt-1 h-5 w-5 shrink-0 accent-[hsl(var(--ea-green))]" {...rest} />
        <label htmlFor={id} className="text-sm">
          {children}
        </label>
      </div>
      <Err id={id} error={error} />
    </div>
  ),
);
CheckField.displayName = 'CheckField';
