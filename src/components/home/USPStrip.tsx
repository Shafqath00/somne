import { motion } from 'framer-motion';
import { usps } from '@/data';

export function USPStrip() {
  return (
    <section className="bg-gray-100 py-6 border-y border-border overflow-hidden">
      <div className="luxury-container">
        {/* Desktop View - Grid */}
        <div className="hidden md:grid md:grid-cols-3">
          {usps.map((usp, index) => {
            return (
              <div key={usp.title} className="relative flex items-center justify-center gap-3 px-6 py-2">
                {/* Short divider on the right, 60% height, vertically centered */}
                {index !== usps.length - 1 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[2px] bg-black/30 rounded-full" />
                )}
                <div className="flex flex-col items-center gap-3 text-center">
                  <img
                    src={usp.icon}
                    alt="icon"
                    className={`${[1].includes(index) ? 'w-[58px]' : ''} ${[2].includes(index) ? 'w-[70px]' : 'w-[90px]'} h-auto`}
                  />
                  <div className="flex flex-col text-center">
                    <p className="font-sans text-2xl font-bold text-foreground">{usp.title}</p>
                    <p className="font-sans text-xs text-muted-foreground">{usp.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View - Infinite Loop */}
        <div className="md:hidden relative w-full">
          <motion.div
            className="flex gap-12 w-max"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...usps, ...usps].map((usp, index) => (
              <div key={`${usp.title}-${index}`} className={`flex flex-col items-center justify-center gap-3`}>
                <div>
                  <img src={usp.icon} alt={usp.title} className={`${[1].includes(index % usps.length) ? 'w-[40px]' : ''} ${[2].includes(index % usps.length) ? 'w-[50px]' : 'w-[60px]'} h-auto`} />
                </div>
                <div className="flex flex-col text-center">
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
