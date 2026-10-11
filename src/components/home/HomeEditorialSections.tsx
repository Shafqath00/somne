import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PackageCheck, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const splitFeature = {
  title: 'Quick delivery',
  description:
    'Do not wait for a finished bedroom. Our ready-to-go bed sets are available with fast delivery and flexible payment options.',
  primaryImage: '/img/home/twobed/bed1.png',
  detailImage: '/img/home/twobed/bed2.png',
  href: '/beds/divan-beds',
};

const packagePanels = [
  {
    eyebrow: 'Complete package',
    title: 'Bed frame, mattress and headboard in one calm setup.',
    description: 'Start with the room you want to wake up in, then choose the frame, mattress feel and headboard profile that work together.',
    image: '/img/home/package-hero-bedroom.webp',
    href: '/beds/divan-beds',
    cta: 'Shop bed packages',
  },
  {
    eyebrow: 'Storage package',
    title: 'Ottoman storage with comfort still at the centre.',
    description: 'Make bedding, throws and seasonal pieces disappear into a lift-up base without losing the polished bedroom finish.',
    image: '/img/home/package-storage-bundle.webp',
    href: '/beds/ottoman-divan-beds',
    cta: 'Shop storage beds',
  },
  {
    eyebrow: 'Comfort package',
    title: 'Mattress and headboard pairings that feel finished.',
    description: 'Layer support, softness and headboard style into one coordinated sleep setup for a cleaner buying decision.',
    image: '/img/home/package-mattress-headboard.webp',
    href: '/mattresses',
    cta: 'Find your mattress',
  },
  {
    eyebrow: 'Delivery care',
    title: 'Arrives protected, handled carefully, ready for home.',
    description: 'From packed components to bedroom setup, the experience should feel as considered as the product itself.',
    image: '/img/home/package-delivery-care.webp',
    href: '/contact',
    cta: 'Ask about delivery',
  },
];

const premiumPackages = [
  {
    name: 'The Westminster Package',
    description: 'Upholstered frame, statement headboard and premium mattress pairing.',
    price: '\u00a31,299',
    href: '/product/westminster-upholstered-bed',
  },
  {
    name: 'The Kensington Ottoman Package',
    description: 'Lift-up storage, coordinated headboard and comfort-first mattress setup.',
    price: '\u00a31,499',
    href: '/product/kensington-ottoman-bed',
  },
  {
    name: 'The Mayfair Divan Set',
    description: 'Complete divan base and mattress package with practical storage options.',
    price: '\u00a3899',
    href: '/product/mayfair-divan-set',
  },
  {
    name: 'Signature Divan Package',
    description: 'A refined Somne foundation package for classic bedrooms.',
    price: 'From \u00a3899',
    href: '/beds/divan-beds',
  },
];

const guideItems = [
  {
    icon: PackageCheck,
    title: 'Choose the package',
    text: 'Start with divan, ottoman or upholstered bed styles.',
  },
  {
    icon: Ruler,
    title: 'Set the size',
    text: 'Select the size, storage and headboard shape that fits the room.',
  },
  {
    icon: CheckCircle2,
    title: 'Match comfort',
    text: 'Pair the frame with a mattress feel that supports better sleep.',
  },
  {
    icon: Truck,
    title: 'Delivered with care',
    text: 'Protected delivery and clear updates before your package arrives.',
  },
];

export function HomeEditorialSections() {
  return (
    <>
      <section className="bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-y border-white/10 py-7 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">Beds only offer</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">Get 25% off beds</h2>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="rounded-lg border border-dashed border-white/40 px-6 py-3">
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/50">Use code</span>
              <span className="text-2xl font-black tracking-wide text-white">SOMNE25</span>
            </div>
            <Link
              to="/beds/divan-beds"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
            >
              Shop beds
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-black text-white md:px-0 md:py-0">
        <div className=" gap-3 md:grid md:min-h-screen md:grid-cols-2 md:gap-0 md:overflow-visible">

          {/* LEFT — Primary image with Professional Assembly text */}
          <Link
            to={splitFeature.href}
            className="group relative block min-h-[320px] min-w-[86%] snap-start overflow-hidden bg-zinc-900 md:min-h-screen md:min-w-0 md:rounded-none"
            aria-label="Shop professional assembly"
          >
            <img
              src={splitFeature.primaryImage}
              alt="Neutral upholstered bed set in a styled bedroom"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover "
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" /> */}

            {/* Centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Professional Assembly
              </span>
              <span className="mt-2 text-5xl font-black leading-none text-white md:text-6xl">
                £49
              </span>
            </div>
          </Link>

          {/* RIGHT — Detail image with Bundles with Mattress text */}
          <Link
            to={splitFeature.href}
            className="group relative block min-h-[320px] min-w-[86%] snap-start overflow-hidden bg-zinc-900 md:min-h-screen md:min-w-0 md:rounded-none"
            aria-label="Shop bed bundles with mattress"
          >
            <img
              src={splitFeature.detailImage}
              alt="Close-up detail of a neutral upholstered bed"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/15" />

            {/* Centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Bundles with
              </span>
              <span className="mt-2 text-5xl font-black leading-none text-white md:text-6xl">
                Mattress
              </span>
            </div>
          </Link>

        </div>
      </section>




    </>
  );
}
