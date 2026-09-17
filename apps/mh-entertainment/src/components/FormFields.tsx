import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function FormInput({ label, required, className, ...props }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-editorial uppercase text-foreground/40 mb-2">
        {label} {required && <span className="text-foreground/25">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/20"
      />
    </div>
  );
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export function FormTextarea({ label, required, className, ...props }: FormTextareaProps) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-editorial uppercase text-foreground/40 mb-2">
        {label} {required && <span className="text-foreground/25">*</span>}
      </label>
      <textarea
        {...props}
        required={required}
        rows={4}
        className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground py-3 text-sm text-foreground outline-none transition-colors resize-none placeholder:text-foreground/20"
      />
    </div>
  );
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function FormSelect({ label, required, options, className, ...props }: FormSelectProps) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-editorial uppercase text-foreground/40 mb-2">
        {label} {required && <span className="text-foreground/25">*</span>}
      </label>
      <select
        {...props}
        required={required}
        className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground py-3 text-sm text-foreground outline-none transition-colors appearance-none cursor-pointer"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface FormFileProps {
  label: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  className?: string;
}

export function FormFile({ label, required, accept, multiple, onChange, className }: FormFileProps) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-editorial uppercase text-foreground/40 mb-2">
        {label} {required && <span className="text-foreground/25">*</span>}
      </label>
      <div className="border border-dashed border-foreground/15 hover:border-foreground/30 p-6 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onChange(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <p className="text-xs text-foreground/30">Click to upload{accept ? ` (${accept})` : ''}</p>
      </div>
    </div>
  );
}

interface FormRadioProps {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FormRadio({ label, required, options, value, onChange, className }: FormRadioProps) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-editorial uppercase text-foreground/40 mb-3">
        {label} {required && <span className="text-foreground/25">*</span>}
      </label>
      <div className="flex gap-6">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 border ${value === o.value ? 'border-foreground bg-foreground' : 'border-foreground/25'} flex items-center justify-center transition-colors`}>
              {value === o.value && <div className="w-2 h-2 bg-background" />}
            </div>
            <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors">{o.label}</span>
            <input type="radio" value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
          </label>
        ))}
      </div>
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function FormCheckbox({ label, required, checked, onChange, className }: FormCheckboxProps) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer group ${className || ''}`}>
      <div className={`w-4 h-4 border mt-0.5 flex-shrink-0 ${checked ? 'border-foreground bg-foreground' : 'border-foreground/25'} flex items-center justify-center transition-colors`}>
        {checked && <div className="w-2 h-2 bg-background" />}
      </div>
      <span className="text-xs text-foreground/50 leading-relaxed group-hover:text-foreground transition-colors">
        {label} {required && <span className="text-foreground/25">*</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
    </label>
  );
}
