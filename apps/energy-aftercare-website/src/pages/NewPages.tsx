import { ArrowRight, Factory, Wrench } from 'lucide-react';
import { manufacturerContent as m, approvedInstallersContent as a } from '../content/newPages';
import { approvedInstallers } from '../content/approvedInstallers';
import { Section, Reveal, Card, BtnLink, usePageMeta } from '../components/ui';

function Page({ heading, intro, blocks, Icon, cta, to, ctaText, children }: {
  heading: string; intro: string; blocks: string[]; Icon: typeof Factory; cta: string; to: string; ctaText?: string; children?: React.ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-ea-black text-ea-white">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-ea-green/10 blur-[120px]" />
        <div className="ea-container relative py-20 md:py-28">
          <Reveal>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ea-green text-ea-black"><Icon className="h-7 w-7" /></span>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight md:text-6xl">{heading}</h1>
            <p className="mt-6 max-w-2xl text-xl text-ea-white/85">{intro}</p>
          </Reveal>
        </div>
      </section>
      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b} delay={i * 0.08}><Card onLight className="h-full text-lg">{b}</Card></Reveal>
          ))}
        </div>
        {children}
      </Section>
      <section className="bg-ea-green text-ea-black">
        <div className="ea-container flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          {ctaText && <p className="max-w-2xl text-2xl font-bold">{ctaText}</p>}
          <BtnLink to={to} className="bg-ea-black text-ea-white hover:shadow-none">{cta} <ArrowRight className="h-4 w-4" /></BtnLink>
        </div>
      </section>
    </>
  );
}

export function ManufacturerSupport() {
  usePageMeta(m.meta.title, m.meta.description);
  return <Page heading={m.heading} intro={m.intro} blocks={m.blocks} Icon={Factory} cta={m.ctaButton} ctaText={m.ctaText} to="/#contact" />;
}

function ApprovedInstallerList() {
  if (approvedInstallers.length === 0) return null;
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {approvedInstallers.map((i) => (
        <li key={i.name}>
          <Card onLight>
            <p className="text-lg font-bold">{i.name}</p>
            {i.region && <p className="mt-1 text-ea-black/70">{i.region}</p>}
            {i.website && <a href={i.website} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold underline">{i.website.replace(/^https?:\/\//, '')}</a>}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function ApprovedInstallers() {
  usePageMeta(a.meta.title, a.meta.description);
  return (
    <Page heading={a.heading} intro={a.intro} blocks={a.blocks} Icon={Wrench} cta={a.ctaButton} to="/installer-support#installer-inquiry-form">
      <ApprovedInstallerList />
    </Page>
  );
}
