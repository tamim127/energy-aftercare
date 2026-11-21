import { Link } from 'react-router-dom';
import { Check, ArrowRight, Home as HomeIcon, Compass, Activity, Handshake, Award } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { servicesContent as c, servicePlanDetails } from '../content/services';
import { plansAscending, supportPlansHeading } from '../content/plans';
import { Section, Reveal, Card, BtnLink, usePageMeta } from '../components/ui';
import SiteImage from '../components/SiteImage';
import { PlansGrid } from '../components/PlanCard';

const tierOf = (name: string) => name.split(' ')[0].toLowerCase();
const sectionIcons = [HomeIcon, Compass, Activity, Handshake, Award];


function CheckList({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', dark ? 'bg-ea-green text-ea-black' : 'bg-ea-black text-ea-green')}><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}


export default function Services() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <Section tone="dark" id="plan-details">
        <div className="grid gap-6 md:grid-cols-2">
          {servicePlanDetails.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <Card className={cn('h-full', tierOf(p.name) === 'platinum' && 'border-ea-green')}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ea-grey">{tierOf(p.name)}</p>
                <h3 className="mt-2 text-2xl font-bold">{p.name}</h3>
                <p className="mt-3 text-ea-white/80">{p.description}</p>
                <h4 className="mb-4 mt-6 text-sm font-bold text-ea-green">{p.includedHeading}</h4>
                <CheckList items={p.included} dark />
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><BtnLink to="/book-online">{c.bookOnlineButton} <ArrowRight className="h-4 w-4" /></BtnLink></div>
      </Section>

      <Section tone="light" id={c.advice.id}>
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{c.advice.heading}</h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ea-black/80 leading-relaxed">{c.advice.body}</p>
            <h3 className="mb-4 sm:mb-5 mt-8 sm:mt-10 text-lg sm:text-xl font-bold">{c.advice.listHeading}</h3>
            <CheckList items={c.advice.list} />
            <BtnLink to="/#contact" className="mt-10 bg-ea-black text-ea-white hover:shadow-none">{c.advice.button} <ArrowRight className="h-4 w-4" /></BtnLink>
          </Reveal>
          <Reveal delay={0.1}><SiteImage slot="services-advice" ratio="portrait" /></Reveal>
        </div>
      </Section>

      {c.sections.map((s, idx) => {
        const dark = idx % 2 === 0;
        const Icon = sectionIcons[idx];
        return (
          <Section key={s.id} id={s.id} tone={dark ? 'dark' : 'soft'}>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <Reveal>
                <span className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', dark ? 'bg-ea-green text-ea-black' : 'bg-ea-black text-ea-green')}><Icon className="h-7 w-7" /></span>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">{s.heading}</h2>
                <p className={cn('mt-5 text-lg', dark ? 'text-ea-white/80' : 'text-ea-black/80')}>{s.body}</p>
              </Reveal>
              {s.lists.length > 0 && (
                <div className={cn('grid gap-6', s.lists.length > 1 && 'sm:grid-cols-2')}>
                  {s.lists.map((l, i) => (
                    <Reveal key={l.heading} delay={i * 0.08}>
                      <Card onLight={!dark} className="h-full">
                        <h3 className="mb-5 text-lg font-bold">{l.heading}</h3>
                        <CheckList items={l.items} dark={dark} />
                      </Card>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </Section>
        );
      })}

      <Section tone="dark" id="packages" className="border-t border-ea-grey/15">
        <h2 className="mb-12 text-4xl font-extrabold tracking-tight md:text-5xl">{supportPlansHeading}</h2>
        <PlansGrid plans={plansAscending} />
      </Section>

      <section className="border-t border-ea-grey/15 bg-ea-ink py-20 text-center">
        <div className="ea-container max-w-3xl">
          <h3 className="text-3xl font-extrabold text-ea-white">
            Want to calculate your exact savings & efficiency?
          </h3>
          <p className="mt-4 text-base text-ea-white/70">
            Use our interactive Solar PV & Battery Storage Calculator to estimate your system's annual yield, assess unserviced efficiency risks, and find your optimal support plan.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/calculator" className="inline-flex items-center gap-2 rounded-full bg-ea-green px-8 py-4 text-base font-bold text-ea-black transition-all hover:bg-white">
              Launch Savings Calculator <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
