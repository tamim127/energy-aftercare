import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { Sun, Cpu, BatteryCharging, PlugZap } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { homeContent } from '../content/home';

// Notes copied exactly from the live "Homeowner Services" items.
const byTitle = (t: string) => homeContent.services.items.find((i) => i.title === t)!;
const STAGES = [
  { ...byTitle('Solar Optimisation'), Icon: Sun },
  { ...byTitle('System Diagnostics'), Icon: Cpu },
  { ...byTitle('Battery Management'), Icon: BatteryCharging },
  { ...byTitle('EV Integration'), Icon: PlugZap },
];

const G = 'hsl(var(--ea-green))';
const GR = 'hsl(var(--ea-grey))';

function P({ d, on, w = 2, c = G, delay = 0 }: { d: string; on: boolean; w?: number; c?: string; delay?: number }) {
  return (
    <motion.path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.9, delay, ease: 'easeInOut' }} />
  );
}

function Flow({ d, on }: { d: string; on: boolean }) {
  return <motion.path d={d} fill="none" stroke={G} strokeWidth={2.5} className="ea-flow" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.5 }} />;
}

export function EnergyDrawing({ stage }: { stage: number }) {
  const s = (n: number) => stage >= n;
  return (
    <svg viewBox="0 0 800 480" className="h-full w-full" role="img" aria-label="Home energy system: solar panels, inverter, battery storage and EV charger">
      {/* ground + house (always visible) */}
      <path d="M20 430 H780" stroke={GR} strokeWidth={1} opacity={0.5} />
      <path d="M110 250 L290 110 L470 250" fill="none" stroke={GR} strokeWidth={1.5} />
      <path d="M140 228 V430 H440 V228" fill="none" stroke={GR} strokeWidth={1.5} />
      <path d="M380 430 V350 H420 V430" fill="none" stroke={GR} strokeWidth={1} opacity={0.6} />
      {/* 1 solar */}
      <g transform="translate(150 222) rotate(-37.87)">
        {[0, 1, 2].map((col) => [0, 1].map((row) => (
          <P key={`${col}${row}`} on={s(0)} delay={(col + row) * 0.08}
            d={`M${12 + col * 62} ${-58 + row * 30} h56 v26 h-56 z M${40 + col * 62} ${-58 + row * 30} v26`} />
        )))}
      </g>
      {/* 2 inverter */}
      <P on={s(1)} d="M190 290 h62 v78 h-62 z" />
      <P on={s(1)} c={GR} w={1.5} d="M202 304 h38 v16 h-38 z M210 346 h22" />
      <Flow on={s(1)} d="M222 205 V290" />
      {/* 3 battery */}
      {[0, 1, 2].map((i) => <P key={i} on={s(2)} delay={i * 0.12} d={`M290 ${330 + i * 33} h70 v29 h-70 z`} />)}
      <P on={s(2)} c={GR} w={1.5} d="M300 344 h12 M300 377 h12 M300 410 h12" />
      <Flow on={s(2)} d="M252 330 H290" />
      {/* 4 EV charger + car */}
      <P on={s(3)} d="M520 330 h34 v100 h-34 z M528 342 h18 v18 h-18 z" />
      <P on={s(3)} c={GR} w={1.5} d="M554 370 q30 0 40 30" />
      <P on={s(3)} delay={0.2} d="M590 425 v-30 l30 -32 h90 l34 32 h22 v30 z M626 395 l18 -22 h56 l22 22" />
      <P on={s(3)} delay={0.3} c={GR} d="M640 430 a14 14 0 1 0 0.1 0 M740 430 a14 14 0 1 0 0.1 0" />
      <Flow on={s(3)} d="M360 400 H470 V380 H520" />
      {/* glow nodes */}
      {[[222, 205, 0], [222, 330, 1], [325, 380, 2], [537, 380, 3]].map(([x, y, n]) => (
        <motion.circle key={n} cx={x} cy={y} r={5} fill={G} initial={false} animate={{ opacity: s(n) ? 1 : 0, scale: s(n) ? 1 : 0 }} />
      ))}
    </svg>
  );
}

function Note({ stage, active }: { stage: (typeof STAGES)[number]; active: boolean }) {
  const { Icon } = stage;
  return (
    <div className={cn('rounded-2xl border p-5 transition-all duration-500', active ? 'border-ea-green/70 bg-ea-ink2' : 'border-ea-grey/15 bg-transparent opacity-40')}>
      <div className="flex items-center gap-3">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', active ? 'bg-ea-green text-ea-black' : 'bg-ea-ink2 text-ea-grey')}><Icon className="h-4 w-4" /></span>
        <h3 className="font-bold">{stage.title}</h3>
      </div>
      <p className="mt-3 text-[15px] text-ea-grey">{stage.body}</p>
    </div>
  );
}

export default function EnergyScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStage(Math.min(3, Math.floor(v * 4.2))));

  if (reduce)
    return (
      <section aria-label="Home energy system" className="bg-ea-black py-20 text-ea-white">
        <div className="ea-container">
          <div className="mx-auto max-w-3xl"><EnergyDrawing stage={3} /></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{STAGES.map((s) => <Note key={s.title} stage={s} active />)}</div>
        </div>
      </section>
    );

  return (
    <section ref={ref} aria-label="Home energy system" className="relative h-[400vh] bg-ea-black text-ea-white">
      <div className="sticky top-[75px] flex h-[calc(100vh-75px)] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--ea-green)/0.07),transparent_60%)]" />
        <div className="ea-container relative grid h-full grid-rows-[auto_1fr] items-center gap-4 py-6 lg:grid-cols-[1.6fr_1fr] lg:grid-rows-1 lg:gap-12">
          <div className="mx-auto w-full max-w-[760px]"><EnergyDrawing stage={stage} /></div>
          <div className="self-start lg:self-center">
            <div className="mb-5 flex items-center gap-2" aria-label={`Stage ${stage + 1} of 4`}>
              {STAGES.map((_, i) => (
                <span key={i} className={cn('h-2.5 rounded-full transition-all duration-500', i === stage ? 'w-8 bg-ea-green' : i < stage ? 'w-2.5 bg-ea-green/60' : 'w-2.5 bg-ea-grey/40')} />
              ))}
            </div>
            <div className="lg:hidden" aria-live="polite"><Note stage={STAGES[stage]} active /></div>
            <div className="hidden space-y-3 lg:block">{STAGES.map((s, i) => <Note key={s.title} stage={s} active={i === stage} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
