import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categoryTiles = [
  {
    title: 'Divan Beds',
    eyebrow: 'Complete bases',
    description: 'Supportive bases with optional drawer storage.',
    image: '/img/home/divan.png',
    href: '/beds/divan-beds',
    imagePosition: 'center',
  },
  {
    title: 'Ottoman Beds',
    eyebrow: 'Storage package',
    description: 'Lift-up storage for bedrooms that work harder.',
    image: '/img/home/otto.png',
    href: '/beds/ottoman-divan-beds',
    imagePosition: 'center',
  },
  {
    title: 'Upholstered Beds',
    eyebrow: 'Fabric finish',
    description: 'Soft fabrics, clean lines and made-to-order comfort.',
    image: '/img/home/uphost.png',
    href: '/beds/upholstered-beds',
    imagePosition: 'center',
  },
  {
    title: 'Mattresses',
    eyebrow: 'Comfort layer',
    description: 'Pocket sprung, memory foam and comfort-first designs.',
    image: '/img/home/category-mattress-premium.webp',
    href: '/mattresses',
    imagePosition: 'center',
  },
  {
    title: 'Headboards',
    eyebrow: 'Room finish',
    description: 'Statement shapes to finish the whole room.',
    image: '/img/home/headbed.png',
    href: '/headboards',
    imagePosition: 'center',
  },
  {
    title: 'Panels',
    eyebrow: 'Room finish',
    description: 'Statement shapes to finish the whole room.',
    image: '/img/home/wallpanel.png',
    href: '/product/acoustic-wall-panel-pack-of-4',
    imagePosition: 'center',
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <div>
            {/* <p className="mb-3 text-sm font-semibold uppercase text-black/60">Shop by package need</p> */}
            <h2 className="max-w-2xl text-2xl font-black text-foreground md:text-5xl">
              Choose the foundation of your bedroom package.
            </h2>
          </div>
          <Link to="/beds/divan-beds" className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-zinc-600">
            View all beds
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {categoryTiles.map((category) => (
            <Link
              key={category.title}
              to={category.href}
              className="group relative min-h-[330px] min-w-[82%] snap-start overflow-hidden bg-black shadow-sm transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:min-w-[54%] md:min-h-[390px] md:min-w-0 md:rounded-none lg:min-h-[430px]"
            >
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: category.imagePosition }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-black/8 md:from-black/50 md:via-black/30" /> */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                {/* <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/68">{category.eyebrow}</p> */}
                <h3 className=" text-3xl font-black leading-none lg:text-[2rem]">{category.title}</h3>
                {/* <p className="mt-2 max-w-sm text-sm leading-6 text-white/82">{category.description}</p> */}
                {/* <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
