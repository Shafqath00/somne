import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data';

export function CategoryGrid() {
  return (
    <section className="section-padding bg-background">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
            Our Collection
          </span>
          <h2 className="luxury-heading text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="md:luxury-body text-sm max-w-2xl mx-auto">
            Explore our handcrafted range of luxury beds, mattresses, and headboards.
            Each piece is made to order in our UK workshop.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className={`group relative overflow-hidden rounded-xl hover-lift image-zoom w-full lg:w-[calc((100%-3rem)/3)] ${index === 0 ? 'md:w-full' : 'md:w-[calc(50%-0.75rem)]'
                }`}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl text-cream ">{category.name}</h3>
                  <p className="font-sans text-sm text-cream/80 mb-2">{category.description}</p>
                  <span className="inline-flex items-center gap-2 font-sans text-sm text-accent tracking-wide uppercase group-hover:gap-3 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
