import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex items-center gap-2 text-xs tracking-editorial uppercase whitespace-nowrap px-3 py-2 transition-all duration-300 ${
                i === current
                  ? 'text-black border-b-2 border-black'
                  : i < current
                  ? 'text-black/60'
                  : 'text-black/30'
              }`}
            >
              <span className="text-[10px] font-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="hidden sm:inline">{step.shortLabel}</span>
            </button>
          ))}
        </div>
        <div className="h-px bg-black/10 -mt-px" />
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        <h3 className="font-serif text-xl mb-6 text-black/80">{steps[current].label}</h3>
        {steps[current].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-black/10">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex items-center gap-2 text-xs tracking-editorial uppercase text-black/50 hover:text-black disabled:opacity-20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {current < steps.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-2 text-xs tracking-wide-editorial uppercase bg-black text-white px-8 py-3 hover:bg-white hover:text-black border border-black transition-all duration-300"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-xs tracking-wide-editorial uppercase bg-black text-white px-8 py-3 hover:bg-white hover:text-black border border-black transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
            {!isSubmitting && <Check className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
