import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { bookNowLabel, viewAllPlansLabel, type Plan, type Tier } from '../content/plans';
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
  const top = plan.tier === 'platinum';
  return (
    <article
      className={cn(
        'ea-glow relative flex h-full flex-col overflow-hidden rounded-2xl border bg-ea-ink p-7 text-ea-white',
        s.ring,
        top && 'bg-gradient-to-b from-ea-ink2 to-ea-black shadow-[0_0_60px_-20px_hsl(var(--ea-green)/0.6)] lg:-translate-y-3',
        large && 'p-9',
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', s.bar)} />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ea-grey">{plan.tier}</p>
      <h3 className={cn('mt-3 font-bold leading-tight', large ? 'text-3xl' : 'text-2xl')}>{plan.name}</h3>
      <p className={cn('mt-6 font-extrabold tracking-tight text-ea-green', large ? 'text-6xl' : 'text-5xl')}>{plan.price}</p>
      <div className="mt-8 flex-1" />
      <a
        href="#contact"
        className={cn(top ? btn.primary : btn.outlineDark, 'w-full text-center')}
        aria-label={`${bookNowLabel} ${plan.name}`}
      >
        Enquire Now
      </a>
    </article>
  );
}

export function PlansGrid({ plans, showAll = true }: { plans: Plan[]; showAll?: boolean }) {
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <PlanCard key={p.slug} plan={p} />
        ))}
      </div>
      {showAll && (
        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-semibold text-ea-green hover:underline cursor-pointer"
          >
            {viewAllPlansLabel} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
