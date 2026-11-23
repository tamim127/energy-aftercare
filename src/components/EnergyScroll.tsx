import { Sun, Cpu, BatteryCharging, PlugZap } from 'lucide-react';
import { homeContent } from '../content/home';

const byTitle = (t: string) => homeContent.services.items.find((i) => i.title === t)!;
const ITEMS = [
  { ...byTitle('Solar Optimisation'), Icon: Sun },
  { ...byTitle('System Diagnostics'), Icon: Cpu },
  { ...byTitle('Battery Management'), Icon: BatteryCharging },
  { ...byTitle('EV Integration'), Icon: PlugZap },
];

export default function EnergyScroll({ secondaryImage: _secondaryImage }: { secondaryImage?: string }) {
  return (
    <section className="bg-ea-black text-ea-white pt-2 pb-12 sm:pb-16 border-t border-ea-grey/15">
      <div className="ea-container">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-ea-grey/20 bg-ea-ink/70 p-6 flex flex-col justify-between hover:border-ea-green/50 transition-all group"
            >
              <div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ea-green/10 border border-ea-green/30 text-ea-green mb-4 group-hover:bg-ea-green group-hover:text-ea-black transition-colors">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-ea-white">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-ea-white/70 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
