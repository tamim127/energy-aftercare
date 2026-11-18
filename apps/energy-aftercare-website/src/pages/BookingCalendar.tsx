import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { format, isBefore, startOfToday, isWeekend } from 'date-fns';
import { ArrowLeft, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Calendar } from '@project/components/ui/calendar';
import { plansLiveOrder, bookNowLabel } from '../content/plans';
import { FormField, TextAreaField } from '../components/FormField';
import { btn, usePageMeta } from '../components/ui';
import NotFound from './NotFound';

// Front-end only. Slots follow the live standard support hours (Monday–Friday, 9am–5pm).
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const schema = z.object({
  name: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().min(6, 'Enter a valid phone number'),
  notes: z.string().optional(),
});

export default function BookingCalendar() {
  const { slug } = useParams();
  const plan = plansLiveOrder.find((p) => p.slug === slug);
  usePageMeta(`${plan?.name ?? 'Book Online'} | Energy Aftercare`);
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [vals, setVals] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  if (!plan) return <NotFound />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(vals);
    const next: Record<string, string> = r.success ? {} : Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]));
    if (!date || !slot) next.slot = 'Select a date and time';
    setErrs(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  if (done)
    return (
      <section className="bg-ea-black py-24 text-ea-white">
        <div className="ea-container max-w-xl text-center" role="status">
          <CheckCircle2 className="mx-auto h-16 w-16 text-ea-green" />
          <h1 className="mt-6 text-3xl font-extrabold">{plan.name}</h1>
          <p className="mt-4 text-lg text-ea-white/85">{format(date!, 'EEEE d MMMM yyyy')} · {slot}</p>
          <p className="mt-2 text-ea-green">{plan.price}</p>
          <Link to="/book-online" className={cn(btn.outlineDark, 'mt-10')}><ArrowLeft className="h-4 w-4" /> Book Online</Link>
        </div>
      </section>
    );

  return (
    <section className="bg-ea-black py-14 text-ea-white md:py-20">
      <div className="ea-container">
        <Link to="/book-online" className="inline-flex items-center gap-2 text-sm text-ea-grey hover:text-ea-green"><ArrowLeft className="h-4 w-4" /> Book Online</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{plan.name}</h1>
          <p className="text-4xl font-extrabold text-ea-green">{plan.price}</p>
        </div>
        <form onSubmit={submit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[auto_1fr_1fr]">
          <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-4">
            <p className="mb-2 flex items-center gap-2 px-2 font-bold"><CalendarCheck className="h-4 w-4 text-ea-green" />Date</p>
            <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setSlot(undefined); }} disabled={(d) => isBefore(d, startOfToday()) || isWeekend(d)} className="text-ea-white" />
          </div>
          <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-6">
            <p className="mb-4 font-bold">{date ? format(date, 'EEEE d MMMM') : 'Time'}</p>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Time">
              {SLOTS.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={slot === s} disabled={!date} onClick={() => setSlot(s)}
                  className={cn('min-h-[48px] rounded-xl border text-sm font-semibold transition-colors disabled:opacity-30', slot === s ? 'border-ea-green bg-ea-green text-ea-black' : 'border-ea-grey/30 hover:border-ea-green')}>{s}</button>
              ))}
            </div>
            {errs.slot && <p role="alert" className="mt-3 text-sm text-red-400">{errs.slot}</p>}
          </div>
          <div className="space-y-4 rounded-2xl border border-ea-grey/25 bg-ea-ink p-6">
            <FormField id="b-name" label="Name" required value={vals.name} error={errs.name} onChange={(e) => setVals({ ...vals, name: e.target.value })} />
            <FormField id="b-email" label="Email" type="email" required value={vals.email} error={errs.email} onChange={(e) => setVals({ ...vals, email: e.target.value })} />
            <FormField id="b-phone" label="Phone" type="tel" required value={vals.phone} error={errs.phone} onChange={(e) => setVals({ ...vals, phone: e.target.value })} />
            <TextAreaField id="b-notes" label="Tell us more" value={vals.notes} onChange={(e) => setVals({ ...vals, notes: e.target.value })} />
            <button type="submit" className={cn(btn.primary, 'w-full')}>{bookNowLabel}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
