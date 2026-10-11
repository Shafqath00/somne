import { motion, useReducedMotion } from 'framer-motion';

const LETTERS = 'SOMNE'.split('');

const TAPE_ITEMS = Array(20).fill(null); // duplicate for seamless loop

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const tapeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[80svh] overflow-hidden bg-black text-white md:min-h-screen">

      {/* ── Background images ── */}
      <div className="absolute inset-0">
        <img
          src="/img/home/hero_mobile_image.png"
          alt="A complete Somne bed package in a monochrome bedroom"
          className="md:hidden h-full w-full object-cover object-[center_20%]"
        />
        <img
          src="/img/home/hero_image.png"
          alt="A complete Somne bed package in a monochrome bedroom"
          className="hidden md:block h-full w-full object-cover object-[58%_center] md:object-center"
        />
      </div>

      {/* ── Gradient vignette ── */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 md:hidden"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-[80svh] flex-col items-center justify-end pb-0 px-4 pt-[calc(4.5rem+env(safe-area-inset-top))] md:min-h-screen md:justify-center md:pb-0 md:pt-0">

        {/* Mobile animated wordmark */}
        <div className="md:hidden flex flex-col items-center gap-3 pb-10">
          <motion.div
            className="flex"
            variants={containerVariants}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            aria-label="SOMNE"
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="text-[22vw] font-black leading-none tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            variants={taglineVariants}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            className="text-[11px] uppercase tracking-[0.35em] text-white/60 font-medium"
          >
            Sleep Engineered
          </motion.p>
        </div>

        {/* Desktop wordmark */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <h1 className="text-center text-6xl font-black leading-none tracking-normal text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] lg:text-9xl">
            SOMNE
          </h1>
        </div>

      </div>

      {/* ── Offer Tape — absolutely pinned to the bottom ── */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 z-20 overflow-hidden"
        variants={tapeVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
      >
        <div className="flex bg-[#C0392B] h-16 items-center">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: shouldReduceMotion
                ? 'none'
                : 'somne-tape-scroll 18s linear infinite',
            }}
          >
            {TAPE_ITEMS.map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-10  text-white uppercase tracking-widest font-black text-lg px-10"
              >
                25% OFF
                <span className=" text-xl tracking-[0.18em]">
                  SOMNE25
                </span>
                <span className="w-0.5 h-10  bg-white flex-shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Tape scroll keyframe ── */}
      <style>{`
        @keyframes somne-tape-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}