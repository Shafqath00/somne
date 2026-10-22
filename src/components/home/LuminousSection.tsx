import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function LuminousSection() {
  return (
    <section className="bg-white py-12 md:py-24">
      <div className="mx-6 md:mx-12 lg:mx-20">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
              ENLIGHTEN YOUR HOME
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black leading-tight mb-6 relative">
              Luminous Living: Innovative Lighting Designs
              <span className="absolute -left-4 top-0 bottom-0 w-1 bg-black/10 rounded-full md:hidden"></span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
              Most of the style's furniture has a touch of modern European 
              furniture with a simple design to create harmony with the dark 
              interior design.
            </p>
            <Button variant="default" size="lg" className="rounded-full px-8 py-6 bg-black text-white hover:bg-gray-800" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/img/interior.jpg" 
                alt="Luminous Living Interior" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 aspect-[4/3]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
