import { useState } from 'react';
import { ArrowRight, Factory, CheckCircle2, Loader2, AlertCircle, Send, Check } from 'lucide-react';
import { manufacturerContent as m } from '../content/newPages';
import { usePageContent } from '../wix/cms';
import { Section, Reveal, Card, usePageMeta, btn } from '../components/ui';
import { FormField, TextAreaField } from '../components/FormField';
import { submitInquiry } from '../wix/submissions';
import { cn } from '@project/components/lib/utils';

export function ManufacturerSupport() {
  const page = usePageContent('manufacturer-support');
  usePageMeta(m.meta.title, m.meta.description);

  const [form, setForm] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    products: '',
    requirements: '',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.company.trim() || !form.contactName.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrorMsg('Please complete company name, contact name, email and telephone.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitInquiry({
        type: 'Contact',
        name: `${form.contactName} (${form.company})`,
        email: form.email,
        phone: form.phone,
        message: `[MANUFACTURER SUPPORT INQUIRY]\nCompany: ${form.company}\nProducts: ${form.products || 'Not specified'}\nRequirements: ${form.requirements || 'Not specified'}\nDetails: ${form.details || 'None provided'}`,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred. Please contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('manufacturer-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ea-black text-ea-white">
        <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-ea-green/10 blur-[130px]" />
        <div className="ea-container relative py-12 sm:py-20 md:py-24">
          <Reveal>
            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-ea-green text-ea-black shadow-lg">
              <Factory className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl">
              {m.heading}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg md:text-xl text-ea-white/85 leading-relaxed">
              {m.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToForm}
                className={cn(btn.primary, 'py-3.5 px-8 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl')}
              >
                Discuss UK manufacturer support <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Scope of Services Cards */}
      <Section tone="light">
        <Reveal>
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green">Manufacturer Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ea-black mt-1">
              End-to-End Support Infrastructure in the UK
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {m.blocks.map((b, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Card onLight className="h-full text-base sm:text-lg leading-relaxed flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ea-black text-ea-green mb-4">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                  <p>{b}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Dedicated Inquiry Form Section */}
      <section id="manufacturer-form" className="bg-ea-black text-ea-white py-16 sm:py-24 border-t border-ea-grey/15">
        <div className="ea-container max-w-3xl">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green">Partner With Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Discuss UK Manufacturer Support</h2>
            <p className="text-sm sm:text-base text-ea-white/70 max-w-xl mx-auto">
              Tell us about your company, products, and support requirements. Our senior technical management team will review and schedule an initial consultation.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-ea-green/50 bg-ea-ink p-8 sm:p-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-ea-green/10 border border-ea-green/40 flex items-center justify-center text-ea-green mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-ea-white">Inquiry Received</h3>
              <p className="text-sm sm:text-base text-ea-white/80 max-w-lg mx-auto">
                Thank you for reaching out regarding UK manufacturer support for <strong className="text-ea-green">{form.company}</strong>. Our team will review your requirements and respond within 1 business day.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    company: '',
                    contactName: '',
                    email: '',
                    phone: '',
                    products: '',
                    requirements: '',
                    details: '',
                  });
                }}
                className={cn(btn.outlineDark, 'mt-4 px-6 py-2.5 text-xs font-bold')}
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 sm:p-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="mfg-company"
                  label="Company Name"
                  required
                  placeholder="e.g. Solis, GivEnergy, Fox ESS"
                  value={form.company}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
                <FormField
                  id="mfg-contact"
                  label="Contact Name"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={form.contactName}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="mfg-email"
                  label="Work Email"
                  type="email"
                  required
                  placeholder="e.g. s.jenkins@company.com"
                  value={form.email}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <FormField
                  id="mfg-phone"
                  label="Telephone / Mobile"
                  type="tel"
                  required
                  placeholder="+44 7987 654321"
                  value={form.phone}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <FormField
                id="mfg-products"
                label="Products & Hardware Focus"
                placeholder="e.g. Hybrid Inverters, High-Voltage Battery Storage, Commercial Solar, EV Chargers"
                value={form.products}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, products: e.target.value })}
              />

              <FormField
                id="mfg-requirements"
                label="Support Requirements"
                placeholder="e.g. Pre-launch setup, backlogs cover, installer training, RMA & warranty coordination"
                value={form.requirements}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />

              <TextAreaField
                id="mfg-details"
                label="Additional Project Details"
                placeholder="Please share any upcoming product launches, timeline, expected volume, or specific UK support objectives..."
                value={form.details}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
              />

              {errorMsg && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs font-semibold text-red-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(btn.primary, 'w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer')}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Submit Manufacturer Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export { default as ApprovedInstallers } from './ApprovedInstallers';
