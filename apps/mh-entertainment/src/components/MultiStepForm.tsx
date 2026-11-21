import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

interface Step {
  label: string;
  shortLabel: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function MultiStepForm({ steps, onSubmit, isSubmitting, submitLabel }: MultiStepFormProps) {
  const [current, setCurrent] = useState(0);

  const goNext = () => { if (current < steps.length - 1) setCurrent(current + 1); };
  const goPrev = () => { if (current > 0) setCurrent(current - 1); };

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex items-center gap-2 text-xs tracking-editorial uppercase whitespace-nowrap px-3 py-2.5 transition-all duration-300 ${
                i === current
                  ? 'text-foreground border-b-2 border-foreground'
                  : i < current
                  ? 'text-foreground/50'
                  : 'text-foreground/25'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono border transition-colors ${
                i === current ? 'border-foreground text-foreground' : i < current ? 'border-foreground/30 text-foreground/50 bg-foreground/5' : 'border-foreground/15 text-foreground/25'
              }`}>
                {i < current ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{step.shortLabel}</span>
            </button>
          ))}
        </div>
        <div className="h-px bg-foreground/10 -mt-px" />
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        <h3 className="font-serif text-xl mb-8 text-foreground/80">{steps[current].label}</h3>
        {steps[current].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-foreground/10">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex items-center gap-2 text-xs tracking-editorial uppercase text-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {current < steps.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-2 text-xs tracking-wide-editorial uppercase bg-foreground text-background px-8 py-3.5 hover:bg-transparent hover:text-foreground border border-foreground transition-all duration-300"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-xs tracking-wide-editorial uppercase bg-foreground text-background px-8 py-3.5 hover:bg-transparent hover:text-foreground border border-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                {submitLabel}
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
