import { cn } from '@project/components/lib/utils';

// Loads src/assets/images/<slot>.<ext>. Until a file exists, renders an empty, correctly
// proportioned black frame (no text, no placeholder picture).
const files = import.meta.glob('../assets/images/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function findSlot(slot: string): string | undefined {
  const key = Object.keys(files).find((k) => k.split('/').pop()?.replace(/\.[^.]+$/, '') === slot);
  return key ? files[key] : undefined;
}

const ratios = {
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
} as const;

export default function SiteImage({
  slot,
  ratio,
  alt = '',
  className,
}: {
  slot: string;
  ratio: keyof typeof ratios;
  alt?: string;
  className?: string;
}) {
  const src = findSlot(slot);
  return (
    <div
      data-slot={slot}
      className={cn('relative overflow-hidden rounded-2xl border border-ea-grey bg-ea-black', ratios[ratio], className)}
    >
      {src && <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
    </div>
  );
}
