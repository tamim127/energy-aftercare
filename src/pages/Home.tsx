import { Sun, BatteryCharging, PlugZap, Activity, KeyRound, Compass, ArrowRight, Mail, Phone } from 'lucide-react';
import { homeContent as c } from '../content/home';
import { plansAscending, supportPlansHeading } from '../content/plans';
import { contact } from '../content/site';
import { usePageContent, useServicesList, useSiteSettings } from '../wix/cms';
import { Section, Reveal, Card, BtnLink, Eyebrow } from '../components/ui';
import { usePageMeta } from '../components/ui';
import CalculatorPreview from '../components/CalculatorPreview';
import { PlansGrid } from '../components/PlanCard';
import ContactForm from '../components/ContactForm';

const serviceIcons = [Sun, BatteryCharging, PlugZap, Activity, KeyRound, Compass];
const iconMap: Record<string, any> = {
  Sun,
  BatteryCharging,
  PlugZap,
  Activity,
  KeyRound,
  Compass,
};

function Hero({ page }: { page: any }) {
  return (
    <section className="relative overflow-hidden bg-ea-black text-ea-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-ea-green/10 blur-[120px]" />
      <div className={`ea-container relative py-12 sm:py-16 md:py-24 ${page.heroImage ? 'grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]' : ''}`}>
        <Reveal>
          <Eyebrow>{page.heroSubheading || c.hero.eyebrow}</Eyebrow>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.08] tracking-tight max-w-4xl">
            {page.heroHeading || c.hero.h1}
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-ea-white/85 leading-relaxed">
            {page.heroBody || c.hero.body}
          </p>
          <ul className="mt-6 sm:mt-8 flex flex-wrap gap-2" aria-label="Trust badges">
            {c.hero.badges.map((b) => (
              <li key={b} className="rounded-full border border-ea-grey/40 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-medium">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ea-green align-middle" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
            <BtnLink to="/#contact" className="w-full sm:w-auto text-center justify-center">
              {page.heroPrimaryCta || c.hero.primaryCta} <ArrowRight className="h-4 w-4" />
            </BtnLink>
            <BtnLink to="/about" variant="outlineDark" className="w-full sm:w-auto text-center justify-center">
              {page.heroSecondaryCta || 'About Us'}
            </BtnLink>
          </div>
        </Reveal>
        {page.heroImage && (
          <Reveal delay={0.1}>
            <div className="relative mx-auto max-w-[480px]">
              <div className="absolute -inset-3 rounded-[28px] border border-ea-green/30" aria-hidden="true" />
              <img
                src={page.heroImage}
                alt={page.heroHeading || 'Energy Aftercare'}
                className="relative rounded-2xl border border-ea-grey/30 w-full object-cover shadow-2xl"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const page = usePageContent('home');
  const { data: services = [] } = useServicesList('Home');
  const { data: siteSettings } = useSiteSettings();
  const siteContact = siteSettings || contact;

  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <Hero page={page} />
      <CalculatorPreview page={page} />

      <Section tone="light">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {page.section2Heading || c.services.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconMap[s.iconName] || serviceIcons[i % serviceIcons.length];
            return (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card onLight className="h-full">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-black text-ea-green">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-ea-black/80">{s.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="dark" id="plans">
        <Reveal>
          <div className="mb-10 sm:mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-ea-green/40 bg-ea-green/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ea-green mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-ea-green" />
              <span>{page.plansNotice || 'For Homeowners Only • Yearly Subscription'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {page.plansHeading || supportPlansHeading}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-ea-white/80 leading-relaxed">
              {page.plansDescription ||
                'These annual support and maintenance plans are exclusively for residential homeowners and are billed yearly. All plan prices are £X + 20% VAT as a professional service. (For commercial or installer technical partnerships, see our dedicated trade services).'}
            </p>
          </div>
        </Reveal>
        <PlansGrid plans={plansAscending} />
      </Section>

      <Section tone="soft">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {page.section3Heading || c.why.heading}
          </h2>
        </Reveal>
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
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
            {page.ctaHeading || c.journey.heading}
          </h2>
        </Reveal>
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
              <a href={`mailto:${siteContact.email}`} className="flex items-center gap-3 hover:text-ea-green">
                <Mail className="h-5 w-5 text-ea-green" />{siteContact.email}
              </a>
              <a href={siteContact.phoneHref} className="flex items-center gap-3 hover:text-ea-green">
                <Phone className="h-5 w-5 text-ea-green" />{siteContact.phone}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </Section>
    </>
  );
}
