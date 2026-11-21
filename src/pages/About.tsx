import { Sun, PlugZap, Settings2, Target, Users, ArrowRight } from 'lucide-react';
import { aboutContent as c } from '../content/about';
import { Section, Reveal, Card, BtnLink, Eyebrow, usePageMeta } from '../components/ui';
import SiteImage from '../components/SiteImage';

const expIcons = [Sun, PlugZap, Settings2];

export default function About() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <section className="bg-ea-black text-ea-white">
        <div className="ea-container grid items-center gap-8 py-12 sm:py-20 md:py-28 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>{c.origin.eyebrow}</Eyebrow>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight">{c.origin.h1}</h1>
            {c.origin.paragraphs.map((p) => <p key={p} className="mt-4 sm:mt-6 text-base sm:text-lg text-ea-white/85 leading-relaxed">{p}</p>)}
          </Reveal>
          <Reveal delay={0.1}><SiteImage slot="about-origin" ratio="wide" alt="" className="w-full" /></Reveal>
        </div>
      </section>

      <Section tone="light">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ea-black p-6 sm:p-8 text-ea-white md:p-14">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-ea-green" />
            <Eyebrow>{c.mission.eyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight md:text-5xl">{c.mission.heading}</h2>
            <p className="mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg text-ea-white/85 md:text-xl leading-relaxed">{c.mission.body}</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {c.mission.cards.map((card, i) => {
            const Icon = i === 0 ? Target : Users;
            return (
              <Reveal key={card.title} delay={i * 0.08}>
                <Card onLight className="h-full">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-black text-ea-green"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-6 text-2xl font-bold">{card.title}</h3>
                  <p className="mt-3 text-ea-black/80">{card.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">{c.expertise.heading}</h2>
          <p className="mt-6 max-w-3xl text-lg text-ea-white/80">{c.expertise.body}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {c.expertise.cards.map((card, i) => {
            const Icon = expIcons[i];
            return (
              <Reveal key={card.kicker} delay={i * 0.08}>
                <Card className="h-full">
                  <Icon className="h-7 w-7 text-ea-green" />
                  <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ea-grey">{card.kicker}</h3>
                  <h4 className="mt-2 text-2xl font-bold">{card.title}</h4>
                  <p className="mt-3 text-ea-white/75">{card.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <section className="bg-ea-green text-ea-black">
        <div className="ea-container flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{c.cta.heading}</h2>
          <BtnLink to="/#contact" className="bg-ea-black text-ea-white hover:shadow-none">{c.cta.button} <ArrowRight className="h-4 w-4" /></BtnLink>
        </div>
      </section>
    </>
  );
}
