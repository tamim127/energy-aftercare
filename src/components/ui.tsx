import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description ?? '');
  }, [title, description]);
}

type Tone = 'dark' | 'light' | 'soft';
const toneClass: Record<Tone, string> = {
  dark: 'bg-ea-black text-ea-white',
  light: 'bg-ea-white text-ea-black',
  soft: 'bg-ea-soft text-ea-black',
};

export function Section({ tone = 'dark', id, className, children }: { tone?: Tone; id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn(toneClass[tone], 'py-20 md:py-28', className)}>
      <div className="ea-container">{children}</div>
    </section>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, onLight }: { children: ReactNode; onLight?: boolean }) {
  return (
    <p className={cn('mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]', onLight ? 'text-ea-black' : 'text-ea-green')}>
      <span className={cn('h-px w-8', onLight ? 'bg-ea-black' : 'bg-ea-green')} />
      {children}
    </p>
  );
}

const base = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ea-green focus-visible:ring-offset-2 focus-visible:ring-offset-ea-black';
export const btn = {
  primary: cn(base, 'bg-ea-green text-ea-black hover:shadow-[0_0_32px_-4px_hsl(var(--ea-green)/0.7)] hover:-translate-y-0.5'),
  outlineDark: cn(base, 'border border-ea-grey text-ea-white hover:border-ea-green hover:text-ea-green'),
  outlineLight: cn(base, 'border border-ea-black text-ea-black hover:bg-ea-black hover:text-ea-white'),
};

export function BtnLink({ to, variant = 'primary', children, className }: { to: string; variant?: keyof typeof btn; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn(btn[variant], className)}>
      {children}
    </Link>
  );
}

export function Card({ children, className, onLight }: { children: ReactNode; className?: string; onLight?: boolean }) {
  return (
    <div
      className={cn(
        'ea-glow rounded-2xl border p-7',
        onLight ? 'border-ea-grey/60 bg-ea-white text-ea-black' : 'border-ea-grey/25 bg-ea-ink text-ea-white',
        className,
      )}
    >
      {children}
    </div>
  );
}
