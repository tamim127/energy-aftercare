import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M10 6h26l-4 7H6z" fill="currentColor" />
      <path d="M10 17h20l-4 7H6z" fill="hsl(var(--ea-green))" />
      <path d="M10 28h26l-4 7H6z" fill="currentColor" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 text-ea-white" aria-label="Energy Aftercare home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-[0.22em]">ENERGY</span>
        <span className="mt-1 text-[9.5px] font-semibold tracking-[0.42em] text-ea-green">AFTERCARE</span>
      </span>
    </Link>
  );
}
