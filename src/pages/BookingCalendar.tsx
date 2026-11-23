import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { format, isBefore, startOfToday, isWeekend } from 'date-fns';
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
  Lock,
  UserCheck,
  LogIn,
} from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Calendar } from '@project/components/ui/calendar';
import { plansLiveOrder } from '../content/plans';
import { useSupportPlans } from '../wix/cms';
import { FormField, TextAreaField } from '../components/FormField';
import { btn, usePageMeta } from '../components/ui';
import {
  createAppointmentBooking,
  createBookingCheckout,
  fetchAvailableTimeSlots,
  DEFAULT_SLOTS,
  type AvailableSlotInfo,
} from '../wix/bookings';
import { useMember } from '../hooks/useMember';
import NotFound from './NotFound';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
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
  const navigate = useNavigate();
  const { data: plans = plansLiveOrder } = useSupportPlans();
  const plan = plans.find((p) => p.slug === slug);
  usePageMeta(`${plan?.name ?? 'Book Online'} | Energy Aftercare`);

  const { loggedIn, member, loading: memberLoading } = useMember();

  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotInfo[]>(
    DEFAULT_SLOTS.map((s) => ({ time: s, bookable: true }))
  );
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [vals, setVals] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Sync logged in member data into form
  useEffect(() => {
    if (loggedIn && member) {
      const fullName =
        member.displayName ||
        `${member.firstName || ''} ${member.lastName || ''}`.trim();
      setVals((prev) => ({
        ...prev,
        name: prev.name || fullName,
        email: prev.email || member.loginEmail || '',
      }));
    }
  }, [loggedIn, member]);

  // When date changes, query live available time slots from Wix Bookings API
  useEffect(() => {
    if (!date || !plan) return;

    let cancelled = false;
    setLoadingSlots(true);

    fetchAvailableTimeSlots(plan.slug, date)
      .then((slots) => {
        if (!cancelled) {
          setAvailableSlots(slots);
          // If current selected slot is not bookable in newly fetched slots, reset it
          if (slot) {
            const found = slots.find((s) => s.time === slot);
            if (!found || !found.bookable) {
              setSlot(undefined);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Error fetching slots:', err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [date, plan]);

  if (!plan) return <NotFound />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // If user is not logged in, enforce login redirect
    if (!loggedIn) {
      navigate(`/login?redirect=/booking-calendar/${plan.slug}`);
      return;
    }

    const r = schema.safeParse(vals);
    const next: Record<string, string> = r.success
      ? {}
      : Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]));

    if (!date || !slot) {
      next.slot = 'Please select an available appointment date and arrival time';
    }
    setErrs(next);

    if (Object.keys(next).length > 0) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

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
          // If checkout failed or simulated, show confirmation
          setIsRedirectingToCheckout(false);
          setDone(true);
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
      <section className="bg-ea-black py-28 text-ea-white min-h-[70vh] flex items-center justify-center">
        <div className="ea-container max-w-lg text-center" role="status">
          <Loader2 className="mx-auto h-14 w-14 animate-spin text-ea-green" />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Connecting to Secure Wix Checkout...
          </h1>
          <p className="mt-3 text-sm text-ea-grey">
            Please wait while we transfer your {plan.name} appointment to the secure Wix Payment gateway.
          </p>
        </div>
      </section>
    );
  }

  // Confirmation View
  if (done) {
    return (
      <section className="bg-ea-black py-20 text-ea-white min-h-[80vh]">
        <div className="ea-container max-w-2xl text-center space-y-6" role="status">
          <div className="h-16 w-16 rounded-full bg-ea-green/10 border border-ea-green/40 flex items-center justify-center text-ea-green mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Booking Confirmed!</h1>
          <p className="text-base text-ea-white/80">
            Thank you, <strong className="text-ea-green">{vals.name}</strong>. Your{' '}
            <strong>{plan.name}</strong> appointment has been received.
          </p>

          <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 text-left space-y-4">
            <div className="flex justify-between items-baseline border-b border-ea-grey/15 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ea-green">
                  Booked Service
                </span>
                <h3 className="text-xl font-bold text-ea-white mt-1">{plan.name}</h3>
              </div>
              <span className="text-2xl font-extrabold text-ea-green">{plan.price}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-ea-grey block">Date & Time</span>
                <strong className="text-ea-white">
                  {format(date!, 'EEEE d MMMM yyyy')} at {slot}
                </strong>
              </div>
              <div>
                <span className="text-ea-grey block">Duration</span>
                <strong className="text-ea-white">{plan.duration}</strong>
              </div>
              <div>
                <span className="text-ea-grey block">Contact Email</span>
                <span className="text-ea-white">{vals.email}</span>
              </div>
              <div>
                <span className="text-ea-grey block">Contact Phone</span>
                <span className="text-ea-white">{vals.phone}</span>
              </div>
            </div>

            <div className="border-t border-ea-grey/15 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ea-grey block mb-2">
                What to expect on the day:
              </span>
              <ul className="space-y-1.5 text-xs text-ea-white/80">
                {plan.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-ea-green shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/book-online" className={cn(btn.primary, 'py-3 px-8 text-xs font-bold')}>
              Book Another Service
            </Link>
            <Link to="/" className={cn(btn.outlineDark, 'py-3 px-8 text-xs font-bold')}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ea-black py-12 text-ea-white md:py-16">
      <div className="ea-container space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/book-online"
            className="inline-flex items-center gap-2 text-xs font-bold text-ea-grey hover:text-ea-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Support Plans
          </Link>

          <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ea-grey/15 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ea-green flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Direct Engineer Booking
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-1 text-ea-white">
                Book {plan.name}
              </h1>
              <p className="mt-2 text-sm text-ea-white/75 max-w-2xl leading-relaxed">
                {plan.summary}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-3xl sm:text-4xl font-black text-ea-green">{plan.price}</span>
              <p className="text-xs text-ea-grey mt-0.5">Fixed Price • 0% VAT Included</p>
            </div>
          </div>
        </div>

        {/* Member Authentication Status / Required Notice */}
        {!memberLoading && (
          <div>
            {loggedIn ? (
              <div className="rounded-2xl border border-ea-green/40 bg-ea-green/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="h-5 w-5 text-ea-green shrink-0" />
                  <div>
                    <span className="font-bold text-ea-white">
                      Verified Member Account:{' '}
                      <strong className="text-ea-green">
                        {member?.displayName || member?.loginEmail}
                      </strong>
                    </span>
                    <p className="text-ea-grey text-[11px] mt-0.5">
                      Your booking will be recorded under your customer profile and verified by Wix CRM.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ea-green/20 border border-ea-green/40 px-2.5 py-1 text-[11px] font-bold text-ea-green">
                    <Check className="h-3 w-3" /> Authenticated
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ea-white flex items-center gap-2">
                      <span>Member Sign-In Required for Engineer Bookings</span>
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-ea-white/80 max-w-xl leading-relaxed">
                      To ensure verified dispatch of accredited UK engineers and protect system warranty records, please log in or create a customer account before confirming your appointment.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                  <Link
                    to={`/login?redirect=/booking-calendar/${plan.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ea-green px-6 py-3.5 text-xs font-bold text-ea-black hover:bg-ea-green/90 transition-all shadow-lg shadow-ea-green/20"
                  >
                    <LogIn className="h-4 w-4" /> Log In to Continue
                  </Link>
                  <Link
                    to={`/login?mode=register&redirect=/booking-calendar/${plan.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-ea-grey/40 bg-ea-black/50 px-6 py-3.5 text-xs font-bold text-ea-white hover:border-ea-green hover:text-ea-green transition-all"
                  >
                    <UserCheck className="h-4 w-4" /> Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Form & Live Summary Layout (7 cols : 5 cols) */}
        <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Date, Time & Contact Details (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step 1: Appointment Date & Time */}
            <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" /> 1. Select Date &amp; Arrival Time
                </h3>
                {loadingSlots && (
                  <span className="text-xs text-ea-grey flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-ea-green" /> Checking live availability...
                  </span>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Calendar */}
                <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4">
                  <p className="mb-2 text-xs font-bold text-ea-grey uppercase tracking-wider">
                    Preferred Date
                  </p>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setSlot(undefined);
                      setErrs((prev) => ({ ...prev, slot: '' }));
                    }}
                    disabled={(d) => isBefore(d, startOfToday()) || isWeekend(d)}
                    className="text-ea-white mx-auto"
                  />
                </div>

                {/* Slots */}
                <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-ea-grey uppercase tracking-wider">
                      {date ? format(date, 'EEEE d MMMM') : 'Select Date First'}
                    </p>
                    {date && (
                      <span className="text-[10px] text-ea-green font-semibold">UK London Time</span>
                    )}
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 flex-1 content-start mt-2"
                    role="radiogroup"
                    aria-label="Time"
                  >
                    {availableSlots.map(({ time: s, bookable }) => {
                      const isSelected = slot === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={!date || isSubmitting || !bookable}
                          onClick={() => {
                            if (bookable) {
                              setSlot(s);
                              setErrs((prev) => ({ ...prev, slot: '' }));
                            }
                          }}
                          className={cn(
                            'py-3 rounded-xl border text-xs font-bold transition-all relative',
                            !bookable
                              ? 'border-ea-grey/15 bg-ea-black/30 text-ea-grey/40 cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-ea-green bg-ea-green text-ea-black shadow-[0_0_15px_rgba(0,229,117,0.3)]'
                              : 'border-ea-grey/25 bg-ea-black text-ea-grey hover:border-ea-grey/60 hover:text-ea-white cursor-pointer'
                          )}
                        >
                          <span>{s}</span>
                          {!bookable && (
                            <span className="block text-[9px] uppercase tracking-tighter text-red-400 font-semibold no-underline">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {errs.slot && (
                    <p
                      role="alert"
                      className="mt-3 text-xs text-red-400 font-semibold flex items-center gap-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errs.slot}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green">
                2. Contact &amp; Installation Address
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="b-name"
                  label="Full Name"
                  required
                  placeholder="e.g. John Doe"
                  value={vals.name}
                  error={errs.name}
                  disabled={isSubmitting}
                  onChange={(e) => setVals({ ...vals, name: e.target.value })}
                />
                <FormField
                  id="b-email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={vals.email}
                  error={errs.email}
                  disabled={isSubmitting}
                  onChange={(e) => setVals({ ...vals, email: e.target.value })}
                />
              </div>

              <FormField
                id="b-phone"
                label="UK Mobile / Telephone"
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
                label="Property & System Information (optional)"
                placeholder="e.g. 14 panels on slate roof, GivEnergy 9.5kWh battery in garage, inverter error code F24..."
                value={vals.notes}
                disabled={isSubmitting}
                onChange={(e) => setVals({ ...vals, notes: e.target.value })}
              />

              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs font-semibold text-red-300 flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary & Checkout (5 cols) */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-ea-green/40 bg-ea-ink p-6 md:p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="border-b border-ea-grey/15 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ea-green">
                  Booking Summary
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <h3 className="text-xl font-extrabold text-ea-white">{plan.name}</h3>
                  <span className="text-2xl font-black text-ea-green">{plan.price}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-ea-grey">
                  <Clock className="h-3.5 w-3.5 text-ea-green" />
                  <span>
                    Expected Duration: <strong>{plan.duration}</strong>
                  </span>
                </div>
              </div>

              {/* Selected Slot Callout */}
              <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/60 p-4 text-xs">
                <span className="text-ea-grey block font-semibold mb-1">Appointment Time:</span>
                {date && slot ? (
                  <p className="text-sm font-bold text-ea-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-ea-green" />
                    {format(date, 'EEEE d MMMM yyyy')} at {slot}
                  </p>
                ) : (
                  <p className="text-amber-300 italic flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Please pick a date and arrival time
                  </p>
                )}
              </div>

              {/* Inclusions List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ea-white block">
                  What is included in this visit:
                </span>
                <ul className="space-y-2 text-xs text-ea-white/85">
                  {plan.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-ea-green shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditions / Limits */}
              <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/40 p-3.5 text-[11px] text-ea-grey space-y-1">
                <span className="font-bold text-ea-white block">Service Limits &amp; Conditions:</span>
                <p className="leading-relaxed">{plan.conditions}</p>
              </div>

              {/* Checkout / Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    btn.primary,
                    'w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying &amp; Initializing...
                    </>
                  ) : !loggedIn ? (
                    <>
                      <Lock className="h-4 w-4" /> Sign In &amp; Proceed to Checkout
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Book &amp; Pay via Wix Checkout
                    </>
                  )}
                </button>
                <p className="mt-2.5 text-center text-[10px] text-ea-grey">
                  Direct appointment dispatch by certified renewable engineers across the UK.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
