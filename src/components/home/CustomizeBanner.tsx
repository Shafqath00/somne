import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import categoryHeadboard from '@/assets/category-headboard.jpg';

export function CustomizeBanner() {
  return (
    <section className="section-padding bg-primary">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Bespoke Service
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-cream mb-6">
              Customize Your<br />Dream Bed
            </h2>
            <p className="font-sans text-lg text-cream/80 leading-relaxed mb-8">
              Have a specific design in mind? Send us your inspiration photos and we'll
              bring your vision to life. Our skilled craftsmen can create bespoke beds
              and headboards tailored to your exact specifications.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-cream/80 font-sans">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                Share reference images or sketches
              </li>
              <li className="flex items-center gap-3 text-cream/80 font-sans">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                Choose from over 100 fabric options
              </li>
              <li className="flex items-center gap-3 text-cream/80 font-sans">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                Custom sizes available
              </li>
              <li className="flex items-center gap-3 text-cream/80 font-sans">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                Competitive pricing guaranteed
              </li>
            </ul>
            <Button variant="gold" size="xl" asChild>
              <Link to="/customize">Start Your Design</Link>
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={categoryHeadboard}
                alt="Custom headboard design"
                className="w-full aspect-[4/3] object-cover shadow-medium"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent p-6 hidden md:block">
                <p className="font-serif text-2xl text-primary font-medium">100+</p>
                <p className="font-sans text-sm text-primary/80">Fabric Options</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
