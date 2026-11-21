import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { bookOnlineContent as c } from '../content/bookOnline';
import { plansLiveOrder } from '../content/plans';
import { useSupportPlans } from '../wix/cms';
import { PlanCard } from '../components/PlanCard';
import { Reveal, usePageMeta } from '../components/ui';

export default function BookOnline() {
  usePageMeta(
    c.meta.title,
    'Book an engineer visit for your solar or battery system. Choose from our Bronze, Silver, Gold, or Platinum support plans with full on-site testing and certification.'
  );

  const { data: plans = plansLiveOrder } = useSupportPlans();

  return (
    <div className="bg-ea-black text-ea-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-ea-black py-12 sm:py-16 md:py-20 border-b border-ea-grey/15">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-ea-green/10 blur-[140px]" />
        <div className="ea-container relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-ea-grey">
            <Link to="/" className="hover:text-ea-green transition-colors">{c.breadcrumb[0]}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/services" className="hover:text-ea-green transition-colors">{c.breadcrumb[1]}</Link>
          </nav>
          <div className="mt-4 sm:mt-6 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Independent Engineering Visits
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{c.heading}</h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-ea-white/80 leading-relaxed">
              Every Energy Aftercare service visit is conducted on-site by certified renewable specialists.
              Select your tier below to view exact inclusions, duration, and book your appointment directly.
            </p>
          </div>

          {/* Service Guarantees Strip */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 text-xs font-semibold text-ea-white/75">
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-grey/25 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> Complete Electrical & Thermal Check
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-grey/25 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> MCS & Warranty Compliant Health Report
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-grey/25 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> Hardware-Agnostic Independent Engineers
            </span>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-14 md:py-20">
        <div className="ea-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {plans.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} className="h-full">
                <PlanCard plan={p} large />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
