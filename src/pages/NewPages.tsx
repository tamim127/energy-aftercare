import { ArrowRight, Factory, Wrench } from 'lucide-react';
import { manufacturerContent as m, approvedInstallersContent as a } from '../content/newPages';
import { approvedInstallers } from '../content/approvedInstallers';
import { usePageContent } from '../wix/cms';
import { Section, Reveal, Card, BtnLink, usePageMeta } from '../components/ui';

function Page({ heading, intro, blocks, Icon, cta, to, ctaText, children }: {
  heading: string; intro: string; blocks: string[]; Icon: typeof Factory; cta: string; to: string; ctaText?: string; children?: React.ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-ea-black text-ea-white">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-ea-green/10 blur-[120px]" />
        <div className="ea-container relative py-12 sm:py-20 md:py-28">
          <Reveal>
            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-ea-green text-ea-black"><Icon className="h-6 w-6 sm:h-7 sm:w-7" /></span>
            <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{heading}</h1>
            <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-ea-white/85 leading-relaxed">{intro}</p>
          </Reveal>
        </div>
      </section>
      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b} delay={i * 0.08}><Card onLight className="h-full text-base sm:text-lg">{b}</Card></Reveal>
          ))}
        </div>
        {children}
      </Section>
      <section className="bg-ea-green text-ea-black">
        <div className="ea-container flex flex-col items-start justify-between gap-6 py-10 sm:py-14 md:flex-row md:items-center">
          {ctaText && <p className="max-w-2xl text-xl sm:text-2xl font-bold">{ctaText}</p>}
          <BtnLink to={to} className="w-full sm:w-auto text-center justify-center bg-ea-black text-ea-white hover:shadow-none">{cta} <ArrowRight className="h-4 w-4" /></BtnLink>
        </div>
      </section>
    </>
  );
}

export function ManufacturerSupport() {
  const page = usePageContent('manufacturer-support');
  usePageMeta(m.meta.title, m.meta.description);

  const blocks = page.heroBody ? page.heroBody.split('\n\n').filter(Boolean) : m.blocks;

  return (
    <Page
      heading={page.heroHeading || m.heading}
      intro={page.heroSubheading || m.intro}
      blocks={blocks}
      Icon={Factory}
      cta={page.ctaButtonText || m.ctaButton}
      ctaText={page.ctaHeading || m.ctaText}
      to="/#contact"
    />
  );
}

export { default as ApprovedInstallers } from './ApprovedInstallers';
