import {
  ArrowDown,
  ArrowRight,
  Handshake,
  Wrench,
  BookOpen,
  Smartphone,
  MessageSquare,
  TrendingUp,
  HeartHandshake,
  Gauge,
  MonitorSmartphone,
  BatteryCharging,
  Bug,
  Headset,
  Compass,
  Clock,
  Smile,
  BadgeCheck,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  PhoneCall,
  Activity,
  FileCheck2,
} from 'lucide-react';
import { installerContent as c } from '../content/installer';
import { usePageContent } from '../wix/cms';
import { Section, Reveal, BtnLink, usePageMeta } from '../components/ui';
import SiteImage from '../components/SiteImage';
import InstallerForm from '../components/InstallerForm';
import InstallerBookingCalendar from '../components/InstallerBookingCalendar';

const wlIcons = [Handshake, Wrench, BookOpen, Smartphone, MessageSquare, TrendingUp, HeartHandshake];
const remoteIcons = [Gauge, MonitorSmartphone, BatteryCharging, Bug, Headset, Compass];
const themeIcons = [Clock, Smile, BadgeCheck];

const OFFERINGS = [
  {
    title: 'White-Label Customer Care',
    icon: PhoneCall,
    tag: 'Under Your Brand',
    description:
      'We act as your dedicated aftercare department. Incoming calls, emails, customer app onboarding, and routine queries are answered professionally using your company name and SLAs.',
  },
  {
    title: 'Remote Telemetry & Triage Desk',
    icon: Activity,
    tag: 'Save 70% Truck Rolls',
    description:
      'Before rolling an expensive van, our engineers remotely inspect cloud telemetry logs (Solis, GivEnergy, FoxESS, Sunsynk, Tesla, etc.) to diagnose and fix configuration faults remotely.',
  },
  {
    title: 'Manufacturer Warranty & RMA',
    icon: FileCheck2,
    tag: 'Zero Admin Burden',
    description:
      'We gather fault logs, submit warranty claims, coordinate with hardware manufacturers, and track replacement units so your internal team does not waste hours on supplier hold.',
  },
  {
    title: 'Peak Season & Leave Coverage',
    icon: Clock,
    tag: 'Flexible Scale',
    description:
      'Scale your support capacity during summer installation rushes, holidays, or unexpected backlogs. We provide flexible short-term cover or long-term operational peace of mind.',
  },
  {
    title: 'G98/G99 & Commissioning Help',
    icon: ShieldCheck,
    tag: 'DNO Compliance',
    description:
      'Ensure every domestic and commercial array is set up right first time. We help verify inverter parameters, CT clamp orientations, and compliance settings.',
  },
  {
    title: 'Qualified Field Engineer Backup',
    icon: Wrench,
    tag: 'Nationwide Network',
    description:
      'When an on-site visit is genuinely necessary and your engineers are busy with installs, our vetted network of UK technicians can assist with physical site assessments.',
  },
];

export default function InstallerSupport() {
  const page = usePageContent('installer-support');
  usePageMeta(c.meta.title, c.meta.description);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-ea-black text-ea-white">
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-ea-green/10 blur-[130px]" />
        <div className="ea-container relative grid items-center gap-8 sm:gap-12 py-12 sm:py-20 md:py-28 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="mb-4 sm:mb-6 flex gap-2" aria-hidden="true">
              {themeIcons.map((I, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-ea-green/40 text-ea-green"
                >
                  <I className="h-5 w-5" />
                </span>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ea-green/40 bg-ea-green/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ea-green mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>UK Installer Support &amp; Partnerships</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight">
              {page.heroHeading || c.hero.h1}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-ea-white/85 md:text-xl leading-relaxed">
              {page.heroBody || c.hero.body}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
              <BtnLink to="#installer-booking" className="w-full sm:w-auto text-center justify-center">
                Book Consultation Call <CalendarCheck className="h-4 w-4" />
              </BtnLink>
              <BtnLink
                to="#installer-inquiry-form"
                variant="outlineDark"
                className="w-full sm:w-auto text-center justify-center"
              >
                Written Inquiry <ArrowDown className="h-4 w-4" />
              </BtnLink>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative mx-auto max-w-[440px]">
              <div className="absolute -inset-3 rounded-[28px] border border-ea-green/30" aria-hidden="true" />
              <SiteImage slot="installer-hero" ratio="portrait" src={page.heroImage} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Detailed Breakdown of What We Offer Installers */}
      <Section tone="dark" className="border-t border-ea-grey/15">
        <Reveal>
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4" /> Service Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              What We Offer UK Solar &amp; Battery Installers
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ea-white/80 leading-relaxed">
              Managing customer calls, warranty disputes, and inverter faults drains valuable engineering hours. Here is how Energy Aftercare protects your margins and reputation:
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.05} className="h-full">
                <div className="ea-glow relative flex h-full flex-col justify-between rounded-3xl border border-ea-grey/20 bg-ea-ink p-6 sm:p-7 hover:border-ea-green/50 transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ea-green/10 border border-ea-green/30 text-ea-green group-hover:bg-ea-green group-hover:text-ea-black transition-colors">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ea-green bg-ea-green/10 border border-ea-green/30 px-2.5 py-1 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-ea-white">{item.title}</h3>
                    <p className="mt-3 text-sm text-ea-white/75 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 3. White Label Details (Light Section) */}
      <Section tone="light">
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
            {c.whiteLabel.heading}
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.whiteLabel.items.map((item, i) => {
            const Icon = wlIcons[i];
            return (
              <li key={item} className={i === c.whiteLabel.items.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <Reveal delay={i * 0.05} className="h-full">
                  <div className="ea-glow group flex h-full flex-col justify-between gap-8 rounded-2xl border border-ea-grey/60 bg-ea-white p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-black text-ea-green transition-transform group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-lg font-bold leading-snug">{item}</span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-12">
          <BtnLink to="#installer-booking" className="bg-ea-black text-ea-white hover:shadow-none">
            Book Partnership Call <CalendarCheck className="h-4 w-4" />
          </BtnLink>
        </div>
      </Section>

      {/* 4. Remote Support Services */}
      <Section tone="dark">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SiteImage slot="installer-remote" ratio="landscape" src={page.secondaryImage} />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              {page.section2Heading || c.remote.heading}
            </h2>
            <p className="mt-6 text-lg text-ea-white/85">
              {page.section2Body || c.remote.body}
            </p>
          </Reveal>
        </div>
        <h3 className="mb-6 mt-16 text-sm font-bold uppercase tracking-[0.18em] text-ea-green">
          {c.remote.listHeading}
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.remote.items.map((item, i) => {
            const Icon = remoteIcons[i];
            return (
              <li key={item}>
                <Reveal delay={i * 0.05}>
                  <div className="ea-glow flex items-center gap-4 rounded-2xl border border-ea-grey/25 bg-ea-ink p-5">
                    <Icon className="h-6 w-6 shrink-0 text-ea-green" />
                    <span className="font-semibold">{item}</span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 5. Online Booking System for Installers */}
      <Section tone="dark" id="installer-booking" className="border-t border-ea-grey/15">
        <Reveal>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green flex items-center gap-1.5 mb-2">
              <CalendarCheck className="h-4 w-4" /> Direct Online Booking
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Schedule an Installer Partnership Call
            </h2>
            <p className="mt-3 text-base sm:text-lg text-ea-white/80 leading-relaxed">
              Pick a date and time that suits your team. Appointments are held Monday to Friday (weekends and UK Bank Holidays are blocked). We will review your installation volumes and tailor an aftercare package for your business.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <InstallerBookingCalendar />
        </Reveal>
      </Section>

      {/* 6. Written Inquiry & Registration Form */}
      <Section tone="dark" id="installer-inquiry-form" className="border-t border-ea-grey/15">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{c.form.heading}</h2>
            <p className="mt-6 text-lg text-ea-white/85">{c.form.body}</p>
            <div className="mt-10 hidden gap-3 lg:flex" aria-hidden="true">
              {themeIcons.map((I, i) => (
                <span
                  key={i}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ea-ink2 text-ea-green"
                >
                  <I className="h-6 w-6" />
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <InstallerForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
