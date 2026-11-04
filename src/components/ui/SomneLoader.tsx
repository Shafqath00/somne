import { cn } from '@/lib/utils';

export const LOGO_DOTS = ['bg-terracotta', 'bg-saffron', 'bg-jade', 'bg-royal', 'bg-plum'];
const RING_COLOURS = ['bg-terracotta/40', 'bg-saffron/40', 'bg-jade/40', 'bg-royal/40', 'bg-plum/40'];

const SIZES = {
  sm: { text: 'text-[7px]', dot: 'h-[1em] w-[1em]', gap: 'gap-[0.7em]' },
  md: { text: 'text-[12px]', dot: 'h-[1em] w-[1em]', gap: 'gap-[0.8em]' },
  lg: { text: 'text-[18px]', dot: 'h-[1em] w-[1em]', gap: 'gap-[0.85em]' },
} as const;

interface DotsProps {
  size?: keyof typeof SIZES;
  className?: string;
}

/** The five brand dots from the Somne logo, hopping in a wave with a ripple ring. */
export function SomneDots({ size = 'md', className }: DotsProps) {
  const s = SIZES[size];
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-end pt-[1.4em]', s.text, s.gap, className)}
    >
      {LOGO_DOTS.map((colour, i) => (
        <span key={colour} className="relative flex items-end" style={{ animationDelay: `${i * 0.12}s` }}>
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 rounded-full motion-reduce:hidden animate-dot-ring',
              RING_COLOURS[i],
              s.dot
            )}
            style={{ animationDelay: `${i * 0.12 + 0.46}s` }}
          />
          <span
            aria-hidden
            className={cn(
              'relative origin-bottom rounded-full animate-dot-hop motion-reduce:animate-loader-breathe',
              colour,
              s.dot
            )}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        </span>
      ))}
    </span>
  );
}

interface LoaderProps {
  /** Short line shown under the dots */
  label?: string;
  /** Fill the viewport with a soft colour wash behind the loader */
  fullscreen?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Brand loading state: "somne" wordmark with the animated logo dots. */
export function SomneLoader({ label, fullscreen, size = 'lg', className }: LoaderProps) {
  const wordmark = size === 'lg' ? 'text-5xl md:text-6xl' : size === 'md' ? 'text-3xl' : 'text-xl';
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-5 overflow-hidden text-center',
        fullscreen && 'min-h-screen w-full bg-background',
        className
      )}
    >
      {fullscreen && (
        <>
          <span aria-hidden className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-royal/15 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 rounded-full bg-saffron/15 blur-3xl" />
        </>
      )}
      <div className="relative flex animate-loader-in flex-col items-center gap-3">
        <span className={cn('font-display font-semibold italic leading-none tracking-[-0.04em] text-ink', wordmark)}>
          somne
        </span>
        <SomneDots size={size} />
      </div>
      {label && (
        <p className="relative animate-loader-breathe text-[11px] font-bold uppercase tracking-[0.26em] text-ink/50">{label}</p>
      )}
    </div>
  );
}

/** Dots-only inline spinner, a drop-in for `<Loader2 className="animate-spin" />`. */
export function InlineDots({ className }: { className?: string }) {
  return <SomneDots size="sm" className={cn('pt-[1.2em]', className)} />;
}
