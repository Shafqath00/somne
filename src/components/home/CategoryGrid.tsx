import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data';
import categoryMattress from '@/assets/category-mattress.jpg';

export function CategoryGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16">
          {/* <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
            Our Collection
          </span> */}
          <h2 className="luxury-heading text-foreground ">
            Top Categories
          </h2>
          {/* <p className="md:luxury-body text-sm max-w-2xl mx-auto">
            Explore our handcrafted range of luxury beds, mattresses, and headboards.
            Each piece is made to order in our UK workshop.
          </p> */}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
          <Link to="/beds/divan-beds group">
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src="/img/beds/green.png" alt="bed" />
              {/* <div className="absolute inset-0 hover:bg-black/20" /> */}
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Divan Beds</h2>
            </div>
            {/* <h2 className='text-center text-2xl mt-4'>Divan Beds</h2> */}
          </Link>
          <Link to="/beds/upholstered-beds">
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src="/img/beds/black.png" alt="bed" />
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Upholstered Beds</h2>
            </div>
            {/* <h2 className='text-center mt-4'>Upholstered Beds</h2> */}
          </Link>
          <Link to="/beds/ottoman-divan-beds">
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src="/img/beds/pink.png" alt="bed" />
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Ottoman Beds</h2>
            </div>
            {/* <h2 className='text-center mt-4'>Ottoman Beds</h2> */}
          </Link>
          <Link to="/mattresses">
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src={categoryMattress} alt="bed" />
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Mattresses</h2>
            </div>
            {/* <h2 className='text-center mt-4'>Mattresses</h2> */}
          </Link>
          <Link to="/headboards" >
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src="/img/beds/headboard.jpeg" alt="bed" />
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Headboards</h2>
            </div>
            {/* <h2 className='text-center mt-4'>Headboards</h2> */}
          </Link>
          <Link to="/product/acoustic-wall-panel-pack-of-4">
            <div className='rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all relative'>
              <img src="/img/beds/panels.webp" alt="bed" />
              <h2 className='absolute bottom-1/2 translate-y-1/2 left-0 right-0 text-center text-2xl w-fit mx-auto px-2 text-white bg-primary'>Panels</h2>
            </div>
            {/* <h2 className='text-center mt-4'>Panels</h2> */}
          </Link>
        </div>
        {/* <div className='flex justify-center gap-6 mt-6'>

        </div> */}

        {/* <div className="flex flex-wrap justify-center gap-6">
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
        </div> */}
      </div>
    </section>
  );
}
