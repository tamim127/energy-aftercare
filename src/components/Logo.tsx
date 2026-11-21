import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';

export function LogoMark({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <img
      src={logoWhite}
      alt="Energy Aftercare"
      className={`${className} object-contain`}
    />
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center transition-opacity hover:opacity-95 shrink-0 ${className || ''}`}
      aria-label="Energy Aftercare home"
    >
      <img
        src={logoWhite}
        alt="Energy Aftercare"
        className="h-10 w-auto max-w-[145px] sm:h-12 sm:max-w-[180px] md:h-14 md:max-w-[210px] object-contain"
      />
    </Link>
  );
}
