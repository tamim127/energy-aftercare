import { ArrowDown, ArrowRight, Handshake, Wrench, BookOpen, Smartphone, MessageSquare, TrendingUp, HeartHandshake, Gauge, MonitorSmartphone, BatteryCharging, Bug, Headset, Compass, Clock, Smile, BadgeCheck } from 'lucide-react';
import { installerContent as c } from '../content/installer';
import { Section, Reveal, BtnLink, usePageMeta } from '../components/ui';
import SiteImage from '../components/SiteImage';
import InstallerForm from '../components/InstallerForm';

const wlIcons = [Handshake, Wrench, BookOpen, Smartphone, MessageSquare, TrendingUp, HeartHandshake];
const remoteIcons = [Gauge, MonitorSmartphone, BatteryCharging, Bug, Headset, Compass];
// Visual-only framing of the three client themes (time saved, customer experience, professional service) — icons, no added copy.
const themeIcons = [Clock, Smile, BadgeCheck];

export default function InstallerSupport() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <section className="relative overflow-hidden bg-ea-black text-ea-white">
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-ea-green/10 blur-[130px]" />
        <div className="ea-container relative grid items-center gap-8 sm:gap-12 py-12 sm:py-20 md:py-28 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="mb-4 sm:mb-6 flex gap-2" aria-hidden="true">
              {themeIcons.map((I, i) => <span key={i} className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-ea-green/40 text-ea-green"><I className="h-5 w-5" /></span>)}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight">{c.hero.h1}</h1>
            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-ea-white/85 md:text-xl leading-relaxed">{c.hero.body}</p>
            <BtnLink to="#installer-inquiry-form" className="mt-8 sm:mt-10 w-full sm:w-auto text-center justify-center">{c.whiteLabel.button} <ArrowDown className="h-4 w-4" /></BtnLink>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative mx-auto max-w-[440px]">
              <div className="absolute -inset-3 rounded-[28px] border border-ea-green/30" aria-hidden="true" />
              <SiteImage slot="installer-hero" ratio="portrait" />
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="light">
        <Reveal><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">{c.whiteLabel.heading}</h2></Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.whiteLabel.items.map((item, i) => {
            const Icon = wlIcons[i];
            return (
              <li key={item} className={i === c.whiteLabel.items.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <Reveal delay={i * 0.05} className="h-full">
                  <div className="ea-glow group flex h-full flex-col justify-between gap-8 rounded-2xl border border-ea-grey/60 bg-ea-white p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-black text-ea-green transition-transform group-hover:scale-110"><Icon className="h-6 w-6" /></span>
                    <span className="text-lg font-bold leading-snug">{item}</span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-12"><BtnLink to="#installer-inquiry-form" className="bg-ea-black text-ea-white hover:shadow-none">{c.whiteLabel.button} <ArrowRight className="h-4 w-4" /></BtnLink></div>
      </Section>

      <Section tone="dark">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal><SiteImage slot="installer-remote" ratio="landscape" /></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.remote.heading}</h2>
            <p className="mt-6 text-lg text-ea-white/85">{c.remote.body}</p>
          </Reveal>
        </div>
        <h3 className="mb-6 mt-16 text-sm font-bold uppercase tracking-[0.18em] text-ea-green">{c.remote.listHeading}</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.remote.items.map((item, i) => {
            const Icon = remoteIcons[i];
            return (
              <li key={item}>
                <Reveal delay={i * 0.05}>
                  <div className="ea-glow flex items-center gap-4 rounded-2xl border border-ea-grey/25 bg-ea-ink p-5">
                    <Icon className="h-6 w-6 shrink-0 text-ea-green" /><span className="font-semibold">{item}</span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-12"><BtnLink to="#installer-inquiry-form">{c.remote.button} <ArrowRight className="h-4 w-4" /></BtnLink></div>
      </Section>

      <Section tone="dark" id="installer-inquiry-form" className="border-t border-ea-grey/15">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.form.heading}</h2>
            <p className="mt-6 text-lg text-ea-white/85">{c.form.body}</p>
            <div className="mt-10 hidden gap-3 lg:flex" aria-hidden="true">
              {themeIcons.map((I, i) => <span key={i} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ea-ink2 text-ea-green"><I className="h-6 w-6" /></span>)}
            </div>
          </Reveal>
          <Reveal delay={0.1}><InstallerForm /></Reveal>
        </div>
      </Section>
    </>
  );
}
