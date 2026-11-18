import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { bookOnlineContent as c } from '../content/bookOnline';
import { plansLiveOrder } from '../content/plans';
import { PlanCard } from '../components/PlanCard';
import { Reveal, usePageMeta } from '../components/ui';

export default function BookOnline() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <section className="relative overflow-hidden bg-ea-black py-16 text-ea-white md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-ea-green/10 blur-[140px]" />
      <div className="ea-container relative">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-ea-grey">
          <Link to="/" className="hover:text-ea-green">{c.breadcrumb[0]}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/services" className="hover:text-ea-green">{c.breadcrumb[1]}</Link>
        </nav>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">{c.heading}</h1>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plansLiveOrder.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <PlanCard plan={p} large />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
