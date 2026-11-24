import { Link } from 'react-router-dom';
import { Calculator, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Reveal, BtnLink } from './ui';

export default function CalculatorPreview({ page }: { page?: any }) {
  return (
    <section className="relative bg-ea-black text-ea-white py-14 sm:py-20 border-t border-ea-grey/15">
      <div className="ea-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ea-grey/25 bg-gradient-to-br from-ea-ink via-ea-ink-2 to-ea-black p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ea-green/15 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              {/* Left Column: Value proposition */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-ea-green/40 bg-ea-green/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ea-green">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>{page?.calculatorPreviewBadge || 'Free Online Solar Tool'}</span>
                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ea-white">
                  {page?.calculatorPreviewHeading || 'Have an installer quote or planning a solar system?'}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-ea-white/80 leading-relaxed max-w-2xl">
                  {page?.calculatorPreviewBody ||
                    'Use our independent, hardware-agnostic calculator to check whether an installer quote is genuinely fair against UK regional benchmarks, verify equipment warranties, or estimate solar generation, battery payback and annual savings.'}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-ea-white/75">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" />
                    Zero sales pressure
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" />
                    UK regional benchmark pricing
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0" />
                    100% Free & instant results
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive preview card & CTA */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
                <div className="rounded-2xl border border-ea-grey/25 bg-ea-black/70 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-ea-grey/20 text-xs">
                    <span className="flex items-center gap-1.5 text-ea-white/70">
                      <Sparkles className="h-3.5 w-3.5 text-ea-green" />
                      Two Analysis Modes
                    </span>
                    <span className="font-semibold text-ea-green">UK Model 2026</span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                    <Link
                      to="/calculator?mode=quote"
                      className="group flex items-start gap-2.5 rounded-xl bg-ea-ink p-3 border border-ea-grey/15 hover:border-ea-green/50 hover:bg-ea-ink/80 transition-all cursor-pointer"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ea-green/20 text-[11px] font-bold text-ea-green group-hover:bg-ea-green group-hover:text-ea-black transition-colors">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-ea-white flex items-center justify-between">
                          Check an Installer&apos;s Quote
                          <ArrowRight className="h-3.5 w-3.5 text-ea-green opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </p>
                        <p className="text-[12px] text-ea-white/65 mt-0.5">
                          Validate fair price, warranties &amp; hidden extras
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/calculator?mode=new"
                      className="group flex items-start gap-2.5 rounded-xl bg-ea-ink p-3 border border-ea-grey/15 hover:border-ea-green/50 hover:bg-ea-ink/80 transition-all cursor-pointer"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ea-green/20 text-[11px] font-bold text-ea-green group-hover:bg-ea-green group-hover:text-ea-black transition-colors">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-ea-white flex items-center justify-between">
                          Model System from Scratch
                          <ArrowRight className="h-3.5 w-3.5 text-ea-green opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </p>
                        <p className="text-[12px] text-ea-white/65 mt-0.5">
                          Solar &amp; battery sizing, generation &amp; payback
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-5">
                    <BtnLink
                      to="/calculator"
                      className="w-full text-center justify-center shadow-lg shadow-ea-green/20"
                    >
                      <Calculator className="h-4 w-4" />
                      <span>{page?.calculatorPreviewButton || 'Launch Quote Checker'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </BtnLink>
                    <p className="mt-2.5 text-center text-[11px] text-ea-white/50">
                      Instant calculations &bull; No personal details required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
