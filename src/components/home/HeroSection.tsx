import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBedroom from '@/assets/hero-bedroom.jpg';
import { ChevronsDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-end justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 639px)" srcSet="/Somneheromobile.png" />
          <source media="(min-width: 640px)" srcSet="/Somnehero.png" />
          <img
            src="/Somnehero.png"
            alt="Luxury bedroom"
            className="w-full md:h-full h-full object-cover"
          />
        </picture>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" /> */}
      </div>

      {/* Content */}
      <div className="relative luxury-container h-full  md:mb-20 mb-5">
        {/* <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block text-accent font-sans text-sm tracking-[0.3em] uppercase mb-4">
            Handcrafted in the UK
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-cream leading-tight mb-6">
            Luxury Beds & Mattresses
          </h1>
          <p className="font-sans text-lg md:text-xl text-cream/90 leading-relaxed mb-8 max-w-lg">
            Experience hotel-quality comfort in your own home. Premium craftsmanship,
            exceptional materials, and complimentary delivery across the UK.
          </p>

        </div> */}
        <div className="flex  justify-end md:flex-row flex-col  mx-20 md:mx-0 gap-4 ">
          <Button variant="hero" size="xl" className="h-12 px-8 text-sm md:h-14 md:px-10 md:text-base bg-primary text-white hover:bg-primary/80" asChild>
            <Link to="/beds/divan-beds">Divan Beds</Link>
          </Button>
          <Button variant="hero" size="xl" className="h-12 px-8 text-sm md:h-14 md:px-10 md:text-base bg-primary text-white hover:bg-primary/80" asChild>
            <Link to="/beds/ottoman-divan-beds">Ottoman Beds</Link>
          </Button>
          <Button variant="hero" size="xl" className="h-12 px-8 text-sm md:h-14 md:px-10 md:text-base bg-primary text-white hover:bg-primary/80" asChild>
            <Link to="/mattresses/pocket-sprung-mattress">Mattresses</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce">

        <ChevronsDown className="w-12 h-12 text-primary" />

      </div>
    </section>
  );
}
