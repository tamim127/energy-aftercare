import { Sun, BatteryCharging, PlugZap, Activity, KeyRound, Compass, ArrowRight, Mail, Phone } from 'lucide-react';
import { homeContent as c } from '../content/home';
import { plansAscending, supportPlansHeading } from '../content/plans';
import { contact } from '../content/site';
import { Section, Reveal, Card, BtnLink, Eyebrow } from '../components/ui';
import { usePageMeta } from '../components/ui';
import SiteImage from '../components/SiteImage';
import EnergyScroll from '../components/EnergyScroll';
import { PlansGrid } from '../components/PlanCard';
import ContactForm from '../components/ContactForm';

const serviceIcons = [Sun, BatteryCharging, PlugZap, Activity, KeyRound, Compass];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ea-black text-ea-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-ea-green/10 blur-[120px]" />
      <div className="ea-container relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className="text-[2.4rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[4rem]">{c.hero.h1}</h1>
          <p className="mt-6 max-w-xl text-lg text-ea-white/85">{c.hero.body}</p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Trust badges">
            {c.hero.badges.map((b) => (
              <li key={b} className="rounded-full border border-ea-grey/40 px-3.5 py-1.5 text-sm font-medium"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ea-green align-middle" />{b}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <BtnLink to="/#contact">{c.hero.primaryCta} <ArrowRight className="h-4 w-4" /></BtnLink>
            <BtnLink to="/installer-support" variant="outlineDark">{c.hero.secondaryCta}</BtnLink>
          </div>
        </Reveal>
        <Reveal delay={0.15}><SiteImage slot="home-hero" ratio="landscape" className="w-full" /></Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <Hero />
      <EnergyScroll />

      <Section tone="light">
        <Reveal><h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.services.heading}</h2></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.items.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card onLight className="h-full">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-black text-ea-green"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-ea-black/80">{s.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="dark" id="plans">
        <Reveal><h2 className="mb-12 text-4xl font-extrabold tracking-tight md:text-5xl">{supportPlansHeading}</h2></Reveal>
        <PlansGrid plans={plansAscending} />
      </Section>

      <Section tone="soft">
        <Reveal><h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.why.heading}</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {c.why.items.map((w, i) => (
            <Reveal key={w.num} delay={i * 0.06}>
              <Card onLight className="h-full">
                <p className="text-5xl font-extrabold text-ea-black/15">{w.num}</p>
                <h3 className="mt-4 text-xl font-bold">{w.title}</h3>
                <p className="mt-3 text-ea-black/80">{w.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">{c.journey.heading}</h2></Reveal>
        <div className="relative mt-14">
          <div className="absolute bottom-6 left-6 top-6 w-px bg-ea-grey/30 md:bottom-auto md:left-6 md:right-6 md:h-px md:w-auto" aria-hidden="true" />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {c.journey.steps.map((s, i) => (
              <li key={s.num}>
                <Reveal delay={i * 0.1} className="flex gap-6 md:block">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ea-green text-lg font-extrabold text-ea-black ring-8 ring-ea-black">{s.num}</span>
                  <div className="md:mt-8">
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <p className="mt-3 text-ea-white/75">{s.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="dark" id="contact" className="border-t border-ea-grey/15">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.contact.heading}</h2>
            <p className="mt-6 text-lg text-ea-white/85">{c.contact.side}</p>
            <p className="mt-6 text-xs font-bold tracking-[0.16em] text-ea-green">{c.contact.strap}</p>
            <div className="mt-8 space-y-3">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-ea-green"><Mail className="h-5 w-5 text-ea-green" />{contact.email}</a>
              <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-ea-green"><Phone className="h-5 w-5 text-ea-green" />{contact.phone}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </Section>
    </>
  );
}
