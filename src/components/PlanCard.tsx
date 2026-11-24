import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, Shield } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { bookNowLabel, viewAllPlansLabel, cleanPriceNumber, type Plan, type Tier } from '../content/plans';
import { btn } from './ui';

// Tier accents expressed as neutral/green gradients so they stay on-brand.
const tierStyle: Record<Tier, { ring: string; bar: string }> = {
  bronze: { ring: 'border-ea-grey/30', bar: 'from-ea-grey/40 via-ea-grey/10 to-transparent' },
  silver: { ring: 'border-ea-grey/50', bar: 'from-ea-grey via-ea-white/60 to-ea-grey/20' },
  gold: { ring: 'border-ea-green/40', bar: 'from-ea-green/60 via-ea-white/50 to-ea-green/20' },
  platinum: { ring: 'border-ea-green', bar: 'from-ea-green via-ea-white to-ea-green' },
};

export function PlanCard({ plan, large }: { plan: Plan; large?: boolean }) {
  const s = tierStyle[plan.tier];
  const top = plan.tier === 'platinum' || plan.tier === 'gold';
  return (
    <article
      className={cn(
        'ea-glow relative flex h-full flex-col overflow-hidden rounded-3xl border bg-ea-ink text-ea-white transition-all',
        large ? 'p-5 sm:p-6 xl:p-8' : 'p-4 sm:p-5 xl:p-6',
        s.ring,
        plan.tier === 'platinum' &&
          'bg-gradient-to-b from-ea-ink2 to-ea-black shadow-[0_0_60px_-20px_rgba(0,229,117,0.3)] lg:-translate-y-2',
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', s.bar)} />
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-ea-grey whitespace-nowrap shrink-0">
            {plan.tier}
          </p>
          <span className="whitespace-nowrap shrink-0 rounded bg-ea-green/10 border border-ea-green/30 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-ea-green">
            Homeowner • Yearly
          </span>
        </div>
        <span
          className={cn(
            'whitespace-nowrap shrink-0 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
            plan.tier === 'gold' || plan.tier === 'platinum'
              ? 'border-ea-green/30 bg-ea-green/10 text-ea-green'
              : 'border-ea-grey/30 bg-ea-black text-ea-white/80'
          )}
        >
          {plan.tier === 'gold' || plan.tier === 'platinum' ? (
            <>
              <Shield className="h-3 w-3 text-ea-green shrink-0" /> In-Person Available
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 text-ea-green shrink-0" /> Virtual Visit
            </>
          )}
        </span>
      </div>

      <h3 className={cn('mt-3 font-extrabold leading-tight', large ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl')}>
        {plan.name}
      </h3>
      <p className="mt-2 text-xs text-ea-white/75 leading-relaxed min-h-[36px]">
        {plan.summary}
      </p>

      <div className="mt-5 border-y border-ea-grey/15 py-3">
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
          <span className={cn('font-black tracking-tight text-ea-green', large ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl')}>
            {cleanPriceNumber(plan.price)}
            <span className="text-xl sm:text-2xl font-bold text-ea-green ml-1.5 lowercase">+vat</span>
          </span>
          <span className="text-xs font-semibold text-ea-white/80">/ year</span>
        </div>
        <p className="mt-1 text-[11px] text-ea-white/65">
          Homeowner yearly plan • 20% VAT applies ({plan.tier === 'gold' || plan.tier === 'platinum' ? 'in-person support available' : 'virtual support'})
        </p>
      </div>

      {/* Key Inclusions */}
      <ul className="mt-5 space-y-2.5 text-xs text-ea-white/85 flex-1">
        {plan.inclusions.slice(0, 4).map((inc, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-ea-green shrink-0 mt-0.5 stroke-[2.5]" />
            <span className="line-clamp-2">{inc}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-2">
        <Link
          to={`/booking-calendar/${plan.slug}`}
          className={cn(top ? btn.primary : btn.outlineDark, 'w-full text-center py-3 text-xs font-bold flex items-center justify-center gap-2')}
          aria-label={`${bookNowLabel} ${plan.name}`}
        >
          {bookNowLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function PlansGrid({ plans, showAll = true }: { plans: Plan[]; showAll?: boolean }) {
  return (
    <div>
      <div className="grid gap-4 sm:gap-5 xl:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {plans.map((p) => (
          <PlanCard key={p.slug} plan={p} />
        ))}
      </div>
      {showAll && (
        <div className="mt-12 text-center">
          <Link
            to="/services#packages"
            className="inline-flex items-center gap-2 font-bold text-ea-green hover:underline cursor-pointer text-sm"
          >
            {viewAllPlansLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
