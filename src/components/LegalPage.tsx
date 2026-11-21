import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import type { LegalContent } from '../content/types';
import { usePageMeta } from './ui';

export default function LegalPage({ content }: { content: LegalContent }) {
  usePageMeta(content.meta.title, content.meta.description);
  const toc = content.blocks.filter((b): b is Extract<typeof b, { type: 'h2' }> => b.type === 'h2');
  const [active, setActive] = useState(toc[0]?.id);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' });
    toc.forEach((t) => { const el = document.getElementById(t.id); if (el) obs.observe(el); });
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  // Group consecutive list items so they render as real lists.
  const nodes: React.ReactNode[] = [];
  let list: { type: 'li' | 'ol'; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.type === 'ol' ? 'ol' : 'ul';
    nodes.push(<Tag key={`l${nodes.length}`} className={cn('my-4 space-y-2 pl-6', list.type === 'ol' ? 'list-none pl-0' : 'list-disc marker:text-ea-black')}>{list.items.map((t, i) => <li key={i}>{t}</li>)}</Tag>);
    list = null;
  };
  content.blocks.forEach((b, i) => {
    if (b.type === 'li' || b.type === 'ol') {
      if (list && list.type !== b.type) flush();
      if (!list) list = { type: b.type, items: [] };
      list.items.push(b.text);
      return;
    }
    flush();
    if (b.type === 'h2') nodes.push(<h2 key={i} id={b.id} className="mt-14 scroll-mt-28 border-t border-ea-black/10 pt-10 text-2xl font-extrabold tracking-tight">{b.text}</h2>);
    else if (b.type === 'h3') nodes.push(<h3 key={i} className="mt-8 text-lg font-bold">{b.text}</h3>);
    else nodes.push(<p key={i} className="my-4">{b.text}</p>);
  });
  flush();

  return (
    <div className="bg-ea-white text-ea-black">
      <header className="bg-ea-black text-ea-white">
        <div className="ea-container py-10 sm:py-16 md:py-20">
          <h1 className="max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight md:text-5xl">{content.title}</h1>
          <p className="mt-3 sm:mt-4 inline-block rounded-full border border-ea-grey/40 px-3.5 py-1 text-xs sm:text-sm font-medium">{content.lastUpdated}</p>
        </div>
      </header>

      <div className="sticky top-[72px] sm:top-[75px] z-20 border-b border-ea-black/10 bg-ea-white px-4 sm:px-5 py-2.5 sm:py-3 lg:hidden">
        <label htmlFor="toc-select" className="sr-only">Contents</label>
        <select id="toc-select" value={active} onChange={(e) => document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' })} className="h-11 sm:h-12 w-full rounded-xl border border-ea-black/30 bg-ea-white px-3 text-xs sm:text-sm font-semibold">
          {toc.map((t) => <option key={t.id} value={t.id}>{t.text}</option>)}
        </select>
      </div>

      <div className="ea-container grid gap-8 sm:gap-12 py-8 sm:py-12 lg:grid-cols-[280px_1fr] lg:py-16">
        <nav aria-label="Contents" className="hidden lg:block">
          <ol className="sticky top-28 max-h-[calc(100vh-8rem)] space-y-1 overflow-y-auto border-l border-ea-black/10 text-sm">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={cn('-ml-px block border-l-2 py-1.5 pl-4 transition-colors', active === t.id ? 'border-ea-black font-bold text-ea-black' : 'border-transparent text-ea-black/70 hover:text-ea-black')}>{t.text}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-[760px] text-[17px] leading-[1.7]">{nodes}</article>
      </div>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-ea-grey bg-ea-black text-ea-green shadow-lg">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
