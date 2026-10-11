import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  linkHref?: string;
  linkLabel?: string;
}

export function ComingSoon({
  title,
  description,
  linkHref = '/beds/divan-beds',
  linkLabel = 'Explore available beds',
}: ComingSoonProps) {
  return (
    <section className="bg-[#f4f4f4] px-4 py-10 md:px-6 md:py-16">
      <div className="luxury-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-black px-6 py-10 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] md:px-12 ">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.12), transparent 30%)',
            }}
          />
          {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div> */}
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-white/55">
            Coming soon
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            {description}
          </p>
          <Link
            to={linkHref}
            className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
