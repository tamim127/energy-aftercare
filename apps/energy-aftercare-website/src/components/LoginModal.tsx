import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@project/components/ui/dialog';
import { logInLabel } from '../content/site';
import { FormField } from './FormField';
import { btn } from './ui';
import { LogoMark } from './Logo';

const schema = z.object({ email: z.string().email('Enter a valid email'), password: z.string().min(1, 'Required') });

export default function LoginModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [vals, setVals] = useState({ email: '', password: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(vals);
    if (!r.success) {
      setErrs(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrs({});
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setDone(false); }}>
      <DialogContent className="max-w-md rounded-2xl border-ea-grey/30 bg-ea-black p-8 text-ea-white">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-10 w-10 text-ea-white" />
          <DialogTitle className="mt-4 text-2xl font-bold">{logInLabel}</DialogTitle>
          <DialogDescription className="sr-only">{logInLabel}</DialogDescription>
        </div>
        {done ? (
          <p className="py-6 text-center text-ea-green">✓</p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-4 space-y-4">
            <FormField id="login-email" label="Email" type="email" autoComplete="email" value={vals.email} error={errs.email} onChange={(e) => setVals({ ...vals, email: e.target.value })} />
            <FormField id="login-password" label="Password" type="password" autoComplete="current-password" value={vals.password} error={errs.password} onChange={(e) => setVals({ ...vals, password: e.target.value })} />
            <button type="submit" className={`${btn.primary} w-full`}>{logInLabel}</button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
