import { useState } from 'react';
import { format, isBefore, startOfToday } from 'date-fns';
import { Calendar } from '@project/components/ui/calendar';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  Layers,
  FileText,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { isBookingDateDisabled } from '../lib/ukBankHolidays';
import { submitInquiry } from '../wix/submissions';
import { btn } from './ui';

const SLOTS = ['10:00', '11:00', '14:00', '15:00', '16:00'];

export default function InstallerBookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | undefined>(undefined);
  const [vals, setVals] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyInstalls: '10-25 installs/mo',
    notes: '',
  });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleDateSelect = (d: Date | undefined) => {
    if (d && isBookingDateDisabled(d)) return;
    setDate(d);
    setSlot(undefined);
    setErrs((prev) => ({ ...prev, date: '', slot: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const next: Record<string, string> = {};
    if (!date) next.date = 'Please select a preferred consultation date';
    if (!slot) next.slot = 'Please select an available time slot';
    if (!vals.companyName.trim()) next.companyName = 'Company name is required';
    if (!vals.contactName.trim()) next.contactName = 'Contact name is required';
    if (!vals.email.trim() || !/\S+@\S+\.\S+/.test(vals.email)) next.email = 'Valid email is required';
    if (!vals.phone.trim() || vals.phone.length < 7) next.phone = 'Valid UK phone number is required';

    setErrs(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const dateFormatted = format(date!, 'EEEE d MMMM yyyy');
      const res = await submitInquiry({
        name: vals.contactName,
        email: vals.email,
        phone: vals.phone,
        type: 'InstallerBooking',
        subject: `Installer Partnership Consultation: ${vals.companyName} (${dateFormatted} at ${slot})`,
        message: `Company: ${vals.companyName}\nContact: ${vals.contactName}\nMonthly Installs: ${vals.monthlyInstalls}\nRequested Date: ${dateFormatted} at ${slot} (UK Time)\nNotes: ${vals.notes || 'None'}`,
        details: {
          company: vals.companyName,
          requestedDate: dateFormatted,
          requestedSlot: slot,
          monthlyInstalls: vals.monthlyInstalls,
          notes: vals.notes || '',
        },
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(res.error || 'Failed to confirm booking. Please try again or call us directly.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-ea-green/40 bg-ea-ink p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5 shadow-2xl">
        <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-ea-green text-ea-black shadow-lg shadow-ea-green/30">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-ea-white">
          Partnership Consultation Confirmed!
        </h3>
        <p className="text-ea-white/80 text-sm sm:text-base leading-relaxed">
          Thank you, <strong>{vals.contactName}</strong> from <strong>{vals.companyName}</strong>. Your 30-minute discovery consultation has been booked for:
        </p>
        <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/60 p-5 text-sm inline-block w-full max-w-md mx-auto text-left space-y-2">
          <div className="flex items-center justify-between border-b border-ea-grey/15 pb-2">
            <span className="text-ea-grey">Consultation Date:</span>
            <strong className="text-ea-green">{date && format(date, 'EEEE d MMMM yyyy')}</strong>
          </div>
          <div className="flex items-center justify-between border-b border-ea-grey/15 pb-2">
            <span className="text-ea-grey">Time (UK London):</span>
            <strong className="text-ea-white">{slot} (30 mins)</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ea-grey">Meeting Format:</span>
            <span className="text-ea-white">Microsoft Teams / Video Call</span>
          </div>
        </div>
        <p className="text-xs text-ea-grey">
          We have sent meeting calendar details to <strong>{vals.email}</strong>. Our senior installer relations manager will review your systems profile before the call.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setDate(undefined);
            setSlot(undefined);
          }}
          className="mt-4 text-xs text-ea-green hover:underline cursor-pointer"
        >
          Book another consultation
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ea-grey/25 bg-gradient-to-br from-ea-ink via-ea-ink-2 to-ea-black p-6 sm:p-8 lg:p-10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ea-grey/15 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ea-green">
            <ShieldCheck className="h-4 w-4" /> Dedicated Trade Scheduler
          </span>
          <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-ea-white">
            Book an Installer Partnership Call
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-ea-white/70">
            Schedule a 30-minute discovery call with our UK Technical Management team to discuss white-label aftercare, overflow coverage, or warranty triage.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 rounded-xl border border-ea-grey/25 bg-ea-black/60 px-3.5 py-2 text-xs text-ea-white/75">
          <Clock className="h-4 w-4 text-ea-green shrink-0" />
          <span>30 Min Video / Call</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Date & Slot (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ea-grey uppercase tracking-wider">
                1. Select Date (Mon–Fri)
              </span>
              <span className="text-[10px] text-ea-green font-semibold">UK London Time</span>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={isBookingDateDisabled}
              className="text-ea-white mx-auto"
            />
            <div className="mt-3 pt-2.5 border-t border-ea-grey/15 text-center">
              <p className="text-[11px] text-ea-white/60">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ea-green mr-1.5 align-middle" />
                Weekends &amp; UK Bank Holidays are blocked out
              </p>
            </div>
          </div>
          {errs.date && <p className="text-xs font-medium text-rose-400">{errs.date}</p>}

          {/* Time Slots */}
          <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4">
            <span className="text-xs font-bold text-ea-grey uppercase tracking-wider block mb-2">
              2. Select Time Slot {date && `(${format(date, 'EEE, d MMM')})`}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SLOTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setSlot(s);
                    setErrs((prev) => ({ ...prev, slot: '' }));
                  }}
                  disabled={!date}
                  className={`rounded-xl py-2 px-3 text-xs font-bold transition-all text-center border cursor-pointer ${
                    !date
                      ? 'border-ea-grey/15 text-ea-grey/40 cursor-not-allowed'
                      : slot === s
                      ? 'border-ea-green bg-ea-green text-ea-black shadow-md shadow-ea-green/30'
                      : 'border-ea-grey/25 bg-ea-ink text-ea-white hover:border-ea-green hover:text-ea-green'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {errs.slot && <p className="mt-2 text-xs font-medium text-rose-400">{errs.slot}</p>}
          </div>
        </div>

        {/* Right Column: Company & Contact Information (7 cols) */}
        <div className="lg:col-span-7 space-y-5 rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-6">
          <span className="text-xs font-bold text-ea-grey uppercase tracking-wider block mb-1">
            3. Your Business Information
          </span>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ea-white/80 block mb-1.5">Company Name *</label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
                <input
                  type="text"
                  placeholder="e.g. Solar Peak Installations Ltd"
                  value={vals.companyName}
                  onChange={(e) => setVals({ ...vals, companyName: e.target.value })}
                  className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white placeholder:text-ea-grey/50 focus:border-ea-green focus:outline-none"
                />
              </div>
              {errs.companyName && <p className="mt-1 text-xs text-rose-400">{errs.companyName}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-ea-white/80 block mb-1.5">Contact Name *</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
                <input
                  type="text"
                  placeholder="e.g. John Davies"
                  value={vals.contactName}
                  onChange={(e) => setVals({ ...vals, contactName: e.target.value })}
                  className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white placeholder:text-ea-grey/50 focus:border-ea-green focus:outline-none"
                />
              </div>
              {errs.contactName && <p className="mt-1 text-xs text-rose-400">{errs.contactName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ea-white/80 block mb-1.5">Work Email *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
                <input
                  type="email"
                  placeholder="john@solarpeak.co.uk"
                  value={vals.email}
                  onChange={(e) => setVals({ ...vals, email: e.target.value })}
                  className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white placeholder:text-ea-grey/50 focus:border-ea-green focus:outline-none"
                />
              </div>
              {errs.email && <p className="mt-1 text-xs text-rose-400">{errs.email}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-ea-white/80 block mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
                <input
                  type="tel"
                  placeholder="+44 7123 456789"
                  value={vals.phone}
                  onChange={(e) => setVals({ ...vals, phone: e.target.value })}
                  className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white placeholder:text-ea-grey/50 focus:border-ea-green focus:outline-none"
                />
              </div>
              {errs.phone && <p className="mt-1 text-xs text-rose-400">{errs.phone}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ea-white/80 block mb-1.5">Monthly Installation Volume</label>
            <div className="relative">
              <Layers className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
              <select
                value={vals.monthlyInstalls}
                onChange={(e) => setVals({ ...vals, monthlyInstalls: e.target.value })}
                className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white focus:border-ea-green focus:outline-none cursor-pointer"
              >
                <option value="Under 10 installs/mo">Under 10 installs / month</option>
                <option value="10-25 installs/mo">10 – 25 installs / month</option>
                <option value="25-50 installs/mo">25 – 50 installs / month</option>
                <option value="50+ installs/mo">50+ commercial &amp; domestic installs / month</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ea-white/80 block mb-1.5">
              Specific Requirements or Current Bottlenecks (Optional)
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ea-grey" />
              <textarea
                rows={3}
                placeholder="e.g. Looking for GivEnergy/Solis triage support, customer phone cover on weekends, or RMA warranty coordination..."
                value={vals.notes}
                onChange={(e) => setVals({ ...vals, notes: e.target.value })}
                className="w-full rounded-xl border border-ea-grey/30 bg-ea-ink px-4 py-2.5 pl-10 text-xs sm:text-sm text-ea-white placeholder:text-ea-grey/50 focus:border-ea-green focus:outline-none resize-none"
              />
            </div>
          </div>

          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSubmitting
                ? 'bg-ea-grey/40 text-ea-black cursor-not-allowed'
                : 'bg-ea-green text-ea-black hover:shadow-[0_0_32px_-4px_hsl(var(--ea-green)/0.7)] hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Scheduling Consultation...
              </>
            ) : (
              <>
                <CalendarCheck className="h-4 w-4" /> Confirm Consultation Booking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
