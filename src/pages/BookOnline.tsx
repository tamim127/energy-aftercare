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
    'Book dedicated technical support for your solar or battery system. Choose from Bronze and Silver virtual consultation plans, or Gold and Platinum packages with in-person specialist support.'
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
              <ShieldCheck className="h-4 w-4" /> Homeowners Only • Yearly Subscription
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{c.heading}</h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-ea-white/80 leading-relaxed">
              These annual support and maintenance plans are exclusively for residential homeowners, billed yearly. All plan prices are £X + 20% VAT as a service. Choose from virtual consultation plans (Bronze &amp; Silver) or comprehensive in-person support (Gold &amp; Platinum) with certified UK renewable specialists.
            </p>
          </div>

          {/* Service Guarantees Strip */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 text-xs font-semibold text-ea-white/75">
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-grey/25 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> Virtual Consultations (Bronze &amp; Silver)
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-green/30 px-3 py-1.5 sm:px-3.5 sm:py-2 text-ea-green">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> In-Person Visits Available (Gold &amp; Platinum)
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-ea-ink border border-ea-grey/25 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" /> Hardware-Agnostic Independent Specialists
            </span>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-14 md:py-20">
        <div className="ea-container">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ea-green/30 bg-ea-ink p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ea-green/10 text-ea-green border border-ea-green/30 font-extrabold text-xs">
                YEAR
              </span>
              <div>
                <p className="text-sm font-bold text-ea-white">For Homeowners Only • Yearly Subscription</p>
                <p className="text-xs text-ea-white/70">Exclusively for residential homeowners • All plan prices are £X + 20% VAT as a professional service</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-ea-green bg-ea-green/10 border border-ea-green/30 px-3.5 py-1.5 rounded-full">
              + 20% VAT applies
            </span>
          </div>

          <div className="grid gap-4 sm:gap-5 xl:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
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
