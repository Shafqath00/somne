import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usps } from '@/data';

export function USPStrip() {
  const shouldReduceMotion = useReducedMotion();

  // Duplicate items for seamless loop
  const loopItems = [...usps, ...usps];

  return (
    <section className="bg-black py-5 md:py-7 overflow-hidden">
      {/* ── Mobile: infinite marquee loop ── */}
      <div className="md:hidden">
        <motion.div
          className="flex gap-px w-max"
          animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
          transition={{
            duration: 12,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {loopItems.map((usp, index) => (
            <div
              key={`${usp.title}-${index}`}
              className="flex w-[46vw] min-h-[132px] flex-shrink-0 flex-col items-center justify-start bg-zinc-950/70 px-3 py-4 text-center"
            >
              <img
                src={usp.icon}
                alt=""
                aria-hidden="true"
                className={`${
                  index % usps.length === 1
                    ? 'w-12'
                    : index % usps.length === 2
                    ? 'w-14'
                    : 'w-16'
                } h-auto grayscale invert brightness-200`}
              />
              <p className="mt-3 text-sm font-bold text-white">{usp.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-white/60">{usp.description}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Desktop: original 3-column grid ── */}
      <div className="luxury-container hidden md:block">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          {usps.map((usp, index) => (
            <div
              key={usp.title}
              className="flex flex-col items-center justify-start px-6 py-0 text-center"
            >
              <img
                src={usp.icon}
                alt=""
                aria-hidden="true"
                className={`${
                  index === 1 ? 'md:w-14' : index === 2 ? 'md:w-16' : 'md:w-20'
                } h-auto grayscale invert brightness-200`}
              />
              <p className="mt-3 text-2xl font-bold text-white">{usp.title}</p>
              <p className="mt-1 text-xs text-white/60">{usp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}