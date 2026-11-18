import { Sun, Cpu, BatteryCharging, PlugZap } from 'lucide-react';
import { homeContent } from '../content/home';
import SiteImage from './SiteImage';

// Simple two-column section (image + list) — easy to rebuild in Wix.
const byTitle = (t: string) => homeContent.services.items.find((i) => i.title === t)!;
const ITEMS = [
  { ...byTitle('Solar Optimisation'), Icon: Sun },
  { ...byTitle('System Diagnostics'), Icon: Cpu },
  { ...byTitle('Battery Management'), Icon: BatteryCharging },
  { ...byTitle('EV Integration'), Icon: PlugZap },
];

export default function EnergyScroll() {
  return (
    <section className="bg-ea-black text-ea-white">
      <div className="ea-container grid items-center gap-12 py-20 lg:grid-cols-2">
        <SiteImage slot="home-section2" ratio="square" alt="Home energy system" />
        <div className="space-y-6">
          {ITEMS.map(({ title, body, Icon }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ea-green text-ea-black">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1 text-ea-grey">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
