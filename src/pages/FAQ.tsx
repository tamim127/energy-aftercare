import { useMemo, useState } from 'react';
import { Search, Phone, Mail, X, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@project/components/ui/accordion';
import { faqData } from '../content/faqData';
import { useFAQs } from '../wix/cms';
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
    else { flush(); out.push(<p key={i} className="mb-3 last:mb-0 leading-relaxed">{l}</p>); }
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
  const { data: categories = faqData.categories } = useFAQs();
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [userOpenItems, setUserOpenItems] = useState<string[]>([]);

  // Filter categories by selectedCategory and search query
  const cats = useMemo(() => {
    const t = q.trim().toLowerCase();
    const source = selectedCategory === 'ALL'
      ? categories
      : categories.filter((c) => c.heading === selectedCategory);

    return source
      .map((c) => ({
        ...c,
        items: t
          ? c.items.filter((i) => (i.q + ' ' + i.a.join(' ')).toLowerCase().includes(t))
          : c.items,
      }))
      .filter((c) => c.items.length > 0);
  }, [q, selectedCategory, categories]);

  // Total matching questions count
  const totalMatches = useMemo(() => {
    return cats.reduce((acc, c) => acc + c.items.length, 0);
  }, [cats]);

  // When searching, auto-expand all matched question items
  const matchedQuestionIds = useMemo(() => {
    if (!q.trim()) return undefined;
    return cats.flatMap((c) => c.items.map((i) => i.q));
  }, [q, cats]);

  const handleCategorySelect = (catHeading: string) => {
    setSelectedCategory(catHeading);
    const contentEl = document.getElementById('faq-content-area');
    if (contentEl) {
      const topOffset = contentEl.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-ea-black text-ea-white min-h-screen">
      {/* Header and Search Area */}
      <div className="ea-container pb-8 sm:pb-14 pt-10 sm:pt-16 md:pt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          {faqData.h1}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-ea-white/70 max-w-2xl">
          Everything you need to know about independent aftercare, fault diagnostics, maintenance, and technical support for renewable energy systems.
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 sm:mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ea-grey" />
          <label htmlFor="faq-search" className="sr-only">Search questions</label>
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions (e.g. inverter, battery, warranty, quote)..."
            className="h-12 sm:h-14 w-full rounded-full border border-ea-grey/40 bg-ea-ink pl-12 pr-12 text-sm sm:text-base text-ea-white placeholder:text-ea-grey outline-none transition-all focus:border-ea-green focus:ring-1 focus:ring-ea-green"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ea-grey hover:bg-ea-grey/20 hover:text-ea-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sticky Category Tabs (Buttons, No HashRouter 404!) */}
      <nav aria-label="FAQ categories" className="sticky top-[72px] sm:top-[75px] z-20 border-y border-ea-grey/15 bg-ea-black/95 backdrop-blur-md">
        <div className="ea-container flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategorySelect('ALL')}
            className={cn(
              'block whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold tracking-wider transition-all cursor-pointer',
              selectedCategory === 'ALL'
                ? 'border-ea-green bg-ea-green text-ea-black shadow-[0_0_12px_rgba(0,229,117,0.35)]'
                : 'border-ea-grey/30 bg-ea-ink/60 text-ea-grey hover:border-ea-green hover:text-ea-white'
            )}
          >
            ALL CATEGORIES
          </button>
          {categories.map((c) => (
            <button
              key={c.heading}
              type="button"
              onClick={() => handleCategorySelect(c.heading)}
              className={cn(
                'block whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold tracking-wider transition-all cursor-pointer',
                selectedCategory === c.heading
                  ? 'border-ea-green bg-ea-green text-ea-black shadow-[0_0_12px_rgba(0,229,117,0.35)]'
                  : 'border-ea-grey/30 bg-ea-ink/60 text-ea-grey hover:border-ea-green hover:text-ea-white'
              )}
            >
              {c.heading}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div id="faq-content-area" className="ea-container pb-20 pt-6">
        {/* Search Result Feedback Bar */}
        {q.trim() && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ea-green/30 bg-ea-ink/90 p-4 text-xs sm:text-sm">
            <span className="text-ea-white/90">
              Found <strong className="text-ea-green font-bold">{totalMatches}</strong> matching question{totalMatches === 1 ? '' : 's'}{' '}
              for "<span className="text-ea-white font-bold">{q.trim()}</span>"
              {selectedCategory !== 'ALL' && (
                <span className="text-ea-grey"> in {selectedCategory}</span>
              )}
            </span>
            <div className="flex items-center gap-3">
              {selectedCategory !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="font-bold text-ea-green hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Search all categories <ArrowRight className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setQ('')}
                className="font-bold text-ea-grey hover:text-ea-white flex items-center gap-1 cursor-pointer border border-ea-grey/30 rounded-full px-2.5 py-1"
              >
                <X className="h-3.5 w-3.5" /> Clear search
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {cats.length === 0 && (
          <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink/60 py-16 px-6 text-center max-w-xl mx-auto my-8 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ea-green/10 text-ea-green border border-ea-green/30">
              <HelpCircle className="h-7 w-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ea-white">
              No questions found {q ? `matching "${q}"` : 'in this category'}
            </h3>
            <p className="text-sm text-ea-grey max-w-md mx-auto leading-relaxed">
              We couldn't find any questions matching your query. Try searching with different terms or view all categories.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => { setQ(''); setSelectedCategory('ALL'); }}
                className="rounded-full border border-ea-green bg-ea-green text-ea-black font-bold px-6 py-2.5 text-xs transition-colors hover:bg-ea-green/90 cursor-pointer shadow-lg"
              >
                Clear Search & View All FAQs
              </button>
              <a
                href="#/contact"
                className="rounded-full border border-ea-grey/30 bg-ea-black text-ea-white font-bold px-6 py-2.5 text-xs transition-colors hover:border-ea-green hover:text-ea-green"
              >
                Speak to Our Team
              </a>
            </div>
          </div>
        )}

        {/* Categories and Accordions */}
        {cats.map((c) => (
          <section key={c.heading} id={slug(c.heading)} className="scroll-mt-44 pt-8 sm:pt-12 first:pt-4">
            <div className="flex items-center justify-between mb-4 border-b border-ea-grey/15 pb-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-ea-green uppercase">
                {c.heading}
              </h2>
              <span className="text-xs text-ea-grey">
                {c.items.length} question{c.items.length === 1 ? '' : 's'}
              </span>
            </div>

            <Accordion
              type="multiple"
              value={matchedQuestionIds || userOpenItems}
              onValueChange={setUserOpenItems}
              className="space-y-3"
            >
              {c.items.map((i) => (
                <AccordionItem
                  key={i.q}
                  value={i.q}
                  className="rounded-2xl border border-ea-grey/25 bg-ea-ink px-4 sm:px-6 transition-colors data-[state=open]:border-ea-green/60"
                >
                  <AccordionTrigger className="py-4 sm:py-5 text-left text-base sm:text-lg font-semibold hover:no-underline [&>svg]:text-ea-green cursor-pointer">
                    {i.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm sm:text-base leading-relaxed text-ea-white/85">
                    <Answer lines={i.a} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        {/* Still Have Questions Box */}
        {faqData.still && (
          <aside className="mt-16 rounded-3xl border border-ea-green/50 bg-gradient-to-br from-ea-ink2 to-ea-black p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-ea-white">
              {faqData.still.heading}
            </h2>
            <div className="mt-5 space-y-2 text-base sm:text-lg">
              {faqData.still.lines.map((l, i) => (
                <p key={i} className={cn(/:$/.test(l) && 'mt-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-ea-grey')}>
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
