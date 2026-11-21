import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { format, isBefore, startOfToday, isWeekend } from 'date-fns';
import { ArrowLeft, CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Calendar } from '@project/components/ui/calendar';
import { plansLiveOrder, bookNowLabel } from '../content/plans';
import { FormField, TextAreaField } from '../components/FormField';
import { btn, usePageMeta } from '../components/ui';
import { createAppointmentBooking, createBookingCheckout } from '../wix/bookings';
import { getMemberState, subscribeMember } from '../wix/members/member-store';
import NotFound from './NotFound';

// Front-end standard support hours (Monday–Friday, 9am–5pm UK).
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const schema = z.object({
  name: z.string().trim().min(1, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z
    .string()
    .trim()
    .min(6, 'Enter a valid phone number')
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Phone number must have between 7 and 15 digits'),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    const applyMember = () => {
      const state = getMemberState();
      if (state.loggedIn && state.member) {
        setVals((prev) => ({
          ...prev,
          name:
            prev.name ||
            state.member?.displayName ||
            `${state.member?.firstName || ''} ${state.member?.lastName || ''}`.trim(),
          email: prev.email || state.member?.loginEmail || '',
        }));
      }
    };
    applyMember();
    return subscribeMember(applyMember);
  }, []);

  if (!plan) return <NotFound />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const r = schema.safeParse(vals);
    const next: Record<string, string> = r.success
      ? {}
      : Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]));
    if (!date || !slot) next.slot = 'Select a date and time';
    setErrs(next);
    if (Object.keys(next).length > 0) return;

    try {
      setIsSubmitting(true);
      const res = await createAppointmentBooking({
        slug: plan.slug,
        date: date!,
        slot: slot!,
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        notes: vals.notes,
      });

      if (res.success && res.bookingId) {
        setIsRedirectingToCheckout(true);
        const checkoutRes = await createBookingCheckout(res.bookingId);
        if (checkoutRes.success && checkoutRes.checkoutUrl) {
          // Redirect to official Wix hosted checkout for online payment
          window.location.href = checkoutRes.checkoutUrl;
          return;
        } else {
          setIsRedirectingToCheckout(false);
          setSubmitError(
            checkoutRes.error ||
              'Booking was initiated, but could not open payment checkout. Please make sure a payment method is connected in your Wix Dashboard.'
          );
        }
      } else if (res.field === 'phone') {
        setErrs((prev) => ({ ...prev, phone: res.error || 'Invalid phone number' }));
      } else {
        setSubmitError(res.error || 'Failed to complete booking. Please try another slot or time.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRedirectingToCheckout) {
    return (
      <section className="bg-ea-black py-28 text-ea-white">
        <div className="ea-container max-w-lg text-center" role="status">
          <Loader2 className="mx-auto h-14 w-14 animate-spin text-ea-green" />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Redirecting to Secure Wix Checkout...</h1>
          <p className="mt-3 text-sm text-ea-grey">
            Please wait while we connect your {plan.name} booking to Wix online payment.
          </p>
        </div>
      </section>
    );
  }

  if (done)
    return (
      <section className="bg-ea-black py-24 text-ea-white">
        <div className="ea-container max-w-xl text-center" role="status">
          <CheckCircle2 className="mx-auto h-16 w-16 text-ea-green" />
          <h1 className="mt-6 text-3xl font-extrabold">{plan.name}</h1>
          <p className="mt-4 text-lg text-ea-white/85">
            {format(date!, 'EEEE d MMMM yyyy')} · {slot}
          </p>
          <p className="mt-2 text-ea-green">{plan.price}</p>
          <Link to="/book-online" className={cn(btn.outlineDark, 'mt-10')}>
            <ArrowLeft className="h-4 w-4" /> Book Online
          </Link>
        </div>
      </section>
    );

  return (
    <section className="bg-ea-black py-14 text-ea-white md:py-20">
      <div className="ea-container">
        <Link
          to="/book-online"
          className="inline-flex items-center gap-2 text-sm text-ea-grey hover:text-ea-green"
        >
          <ArrowLeft className="h-4 w-4" /> Book Online
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{plan.name}</h1>
          <p className="text-4xl font-extrabold text-ea-green">{plan.price}</p>
        </div>
        <form onSubmit={submit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[auto_1fr_1fr]">
          <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-4">
            <p className="mb-2 flex items-center gap-2 px-2 font-bold">
              <CalendarCheck className="h-4 w-4 text-ea-green" />
              Date
            </p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setSlot(undefined);
              }}
              disabled={(d) => isBefore(d, startOfToday()) || isWeekend(d)}
              className="text-ea-white"
            />
          </div>
          <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-6">
            <p className="mb-4 font-bold">{date ? format(date, 'EEEE d MMMM') : 'Time'}</p>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Time">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={slot === s}
                  disabled={!date || isSubmitting}
                  onClick={() => setSlot(s)}
                  className={cn(
                    'min-h-[48px] rounded-xl border text-sm font-semibold transition-colors disabled:opacity-30',
                    slot === s
                      ? 'border-ea-green bg-ea-green text-ea-black'
                      : 'border-ea-grey/30 hover:border-ea-green'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {errs.slot && (
              <p role="alert" className="mt-3 text-sm text-red-400">
                {errs.slot}
              </p>
            )}
          </div>
          <div className="space-y-4 rounded-2xl border border-ea-grey/25 bg-ea-ink p-6">
            <FormField
              id="b-name"
              label="Name"
              required
              value={vals.name}
              error={errs.name}
              disabled={isSubmitting}
              onChange={(e) => setVals({ ...vals, name: e.target.value })}
            />
            <FormField
              id="b-email"
              label="Email"
              type="email"
              required
              value={vals.email}
              error={errs.email}
              disabled={isSubmitting}
              onChange={(e) => setVals({ ...vals, email: e.target.value })}
            />
            <FormField
              id="b-phone"
              label="Phone"
              type="tel"
              required
              placeholder="+44 7987 654321"
              value={vals.phone}
              error={errs.phone}
              disabled={isSubmitting}
              onChange={(e) => setVals({ ...vals, phone: e.target.value })}
            />
            <TextAreaField
              id="b-notes"
              label="Tell us more"
              value={vals.notes}
              disabled={isSubmitting}
              onChange={(e) => setVals({ ...vals, notes: e.target.value })}
            />
            {submitError && (
              <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-400">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(btn.primary, 'w-full flex items-center justify-center gap-2')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                bookNowLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
