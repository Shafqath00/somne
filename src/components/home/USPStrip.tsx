import { motion } from 'framer-motion';
import { usps } from '@/data';

export function USPStrip() {
  return (
    <section className="bg-secondary py-6 md:py-8 border-y border-border overflow-hidden">
      <div className="luxury-container">
        {/* Desktop View - Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {usps.map((usp, index) => {
            return (
              <div key={usp.title} className={`flex items-center justify-center gap-3 border-r-2 border-black ${index === usps.length - 1 ? 'border-none' : ''}`}>
                <div >
                  <img
                    src={usp.icon}
                    alt="icon"
                    className={`${[1].includes(index) ? 'w-[90px]' : ''} ${[2].includes(index) ? 'w-[90px]' : 'w-[120px]'} h-auto`}
                  />

                </div>
                <div>
                  <p className="font-sans text-2xl font-bold text-foreground">{usp.title}</p>
                  <p className="font-sans text-xs text-muted-foreground">{usp.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View - Infinite Loop */}
        <div className="md:hidden relative w-full">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...usps, ...usps].map((usp, index) => (
              <div key={`${usp.title}-${index}`} className="flex items-center justify-center gap-3 w-[280px]">
                <div>
                  <img src={usp.icon} alt={usp.title} className="w-16 h-auto" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{usp.title}</p>
                  <p className="font-sans text-xs text-muted-foreground">{usp.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
