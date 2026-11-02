import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { featuredBeds, scenes } from '@/data/revamp';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    image: scenes.heroAmbassador,
    position: 'object-[62%_center]',
    eyebrow: 'The Grand Collection',
    title: ['Sleep,', 'beautifully', 'coloured.'],
    copy: 'Handmade British beds in 19 velvets and chenilles. Delivered free, built to last a lifetime of lie-ins.',
    bed: featuredBeds.ambassador,
    accent: 'bg-terracotta',
  },
  {
    image: scenes.glasgowMidnight,
    position: 'object-[60%_center]',
    eyebrow: 'After Dark',
    title: ['Hotel', 'suite', 'feeling.'],
    copy: 'Deep-buttoned chesterfield sleigh beds that turn every night into a five-star stay.',
    bed: featuredBeds.glasgow,
    accent: 'bg-saffron',
  },
  {
    image: scenes.knightsbridgeStorage,
    position: 'object-[55%_center]',
    eyebrow: 'Ottoman Storage',
    title: ['Lift.', 'Store.', 'Dream.'],
    copy: 'Gas-lift ottomans with room for every spare duvet, suitcase and secret stash.',
    bed: featuredBeds.knightsbridge,
    accent: 'bg-royal',
  },
];

const DURATION = 7000;

export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = SLIDES[index];

  useEffect(() => {
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DURATION);
    return () => window.clearTimeout(t);
  }, [index]);

  return (
    <section className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-ink text-white">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <img
            src={slide.image}
            alt={`${slide.bed.name} styled in a Somne bedroom`}
            className={cn('h-full w-full object-cover', slide.position, !reduceMotion && 'animate-ken-burns')}
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility washes */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/25 md:hidden" />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-28 pt-40 sm:px-8 md:justify-center md:pb-24 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09 } },
              exit: { opacity: 0, transition: { duration: 0.3 } },
            }}
            className="max-w-2xl"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] backdrop-blur-md"
            >
              <span className={cn('h-2 w-2 rounded-full', slide.accent)} />
              {slide.eyebrow}
            </motion.p>
            <h1 className="font-display text-[3.4rem] font-normal leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[6.5rem]">
              {slide.title.map((word, i) => (
                <motion.span
                  key={word}
                  variants={{
                    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className={cn('block', i === 1 && 'italic text-saffron')}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              className="mt-6 max-w-md text-base leading-relaxed text-white/85 md:text-lg"
            >
              {slide.copy}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/beds/upholstered-beds"
                className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-gold transition-all hover:bg-white hover:text-ink"
              >
                Shop beds
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/mattresses"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-ink"
              >
                Find your mattress
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Shop-the-look card */}
        <Link
          to={`/product/${slide.bed.slug}`}
          className="group absolute bottom-24 right-5 hidden w-72 items-center gap-4 rounded-3xl border border-white/20 bg-white/15 p-3 pr-5 backdrop-blur-xl transition-all hover:bg-white hover:text-ink md:flex lg:right-12"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
            <img src={slide.image} alt="" className={cn('h-full w-full scale-150 object-cover', slide.position)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Shop the look</p>
            <p className="truncate font-display text-lg leading-tight">{slide.bed.name}</p>
            <p className="text-sm font-semibold">from £{slide.bed.from}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-45" />
        </Link>

        {/* Slide progress + rating */}
        <div className="absolute inset-x-5 bottom-8 flex items-center justify-between gap-6 sm:inset-x-8 lg:inset-x-12">
          <div className="flex flex-1 gap-2 md:max-w-xs">
            {SLIDES.map((s, i) => (
              <button
                key={s.image}
                onClick={() => setIndex(i)}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                aria-label={`Show slide ${i + 1}`}
              >
                {i === index && (
                  <motion.span
                    key={`p-${index}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: DURATION / 1000, ease: 'linear' }}
                  />
                )}
                {i < index && <span className="absolute inset-0 bg-white" />}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/85 sm:flex">
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-saffron text-saffron" />
              ))}
            </span>
            Rated 4.9 by Somne sleepers
          </div>
        </div>
      </div>
    </section>
  );
}
