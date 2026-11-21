import { useMemo, useState } from 'react';
import { Search, Phone, Mail } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@project/components/ui/accordion';
import { faqData } from '../content/faqData';
import { usePageMeta } from '../components/ui';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function Answer({ lines }: { lines: string[] }) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) out.push(<ul key={`u${out.length}`} className="my-2 list-disc space-y-1 pl-6">{bullets.map((b) => <li key={b}>{b}</li>)}</ul>);
    bullets = [];
  };
  lines.forEach((l, i) => {
    if (l.startsWith('•')) bullets.push(l.replace(/^•\s*/, ''));
    else { flush(); out.push(<p key={i} className="mb-3 last:mb-0">{l}</p>); }
  });
  flush();
  return <>{out}</>;
}

const linkify = (l: string) => {
  if (/^\+44/.test(l)) return <a href={`tel:${l.replace(/\s/g, '')}`} className="font-bold text-ea-green hover:underline">{l}</a>;
  if (l.includes('@')) return <a href={`mailto:${l}`} className="font-bold text-ea-green hover:underline">{l}</a>;
  return l;
};

export default function FAQ() {
  usePageMeta(faqData.meta.title, faqData.meta.description);
  const [q, setQ] = useState('');
  const cats = useMemo(() => {
    const t = q.trim().toLowerCase();
    return faqData.categories
      .map((c) => ({ ...c, items: t ? c.items.filter((i) => (i.q + ' ' + i.a.join(' ')).toLowerCase().includes(t)) : c.items }))
      .filter((c) => c.items.length);
  }, [q]);

  return (
    <div className="bg-ea-black text-ea-white">
      <div className="ea-container pb-12 sm:pb-20 pt-10 sm:pt-16 md:pt-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{faqData.h1}</h1>
        <div className="relative mt-6 sm:mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ea-grey" />
          <label htmlFor="faq-search" className="sr-only">Search</label>
          <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions..." className="h-12 sm:h-14 w-full rounded-full border border-ea-grey/40 bg-ea-ink pl-12 pr-5 text-sm sm:text-base outline-none focus:border-ea-green" />
        </div>
      </div>
      <nav aria-label="FAQ categories" className="sticky top-[75px] z-20 border-y border-ea-grey/15 bg-ea-black/95 backdrop-blur">
        <ul className="ea-container flex gap-2 overflow-x-auto py-3 no-scrollbar">
          {faqData.categories.map((c) => (
            <li key={c.heading}><a href={`#${slug(c.heading)}`} className="block whitespace-nowrap rounded-full border border-ea-grey/30 px-4 py-2 text-xs font-bold tracking-wider hover:border-ea-green hover:text-ea-green">{c.heading}</a></li>
          ))}
        </ul>
      </nav>
      <div className="ea-container pb-20 pt-6">
        {cats.length === 0 && <p className="py-12 text-center text-ea-grey">—</p>}
        {cats.map((c) => (
          <section key={c.heading} id={slug(c.heading)} className="scroll-mt-40 pt-12">
            <h2 className="mb-4 text-sm font-bold tracking-[0.2em] text-ea-green">{c.heading}</h2>
            <Accordion type="multiple" className="space-y-3">
              {c.items.map((i) => (
                <AccordionItem key={i.q} value={i.q} className="rounded-2xl border border-ea-grey/25 bg-ea-ink px-5 data-[state=open]:border-ea-green/60">
                  <AccordionTrigger className="py-5 text-left text-lg font-semibold hover:no-underline [&>svg]:text-ea-green">{i.q}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-relaxed text-ea-white/85"><Answer lines={i.a} /></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        {faqData.still && (
          <aside className="mt-16 rounded-3xl border border-ea-green/50 bg-gradient-to-br from-ea-ink2 to-ea-black p-8 md:p-10">
            <h2 className="text-2xl font-extrabold tracking-wide">{faqData.still.heading}</h2>
            <div className="mt-5 space-y-1 text-lg">
              {faqData.still.lines.map((l, i) => (
                <p key={i} className={cn(/:$/.test(l) && 'mt-4 text-sm font-bold uppercase tracking-wider text-ea-grey')}>
                  {/^\+44/.test(l) && <Phone className="mr-2 inline h-4 w-4 text-ea-green" />}
                  {l.includes('@') && <Mail className="mr-2 inline h-4 w-4 text-ea-green" />}
                  {linkify(l)}
                </p>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
