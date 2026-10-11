const features = {
  divan: {
    eyebrow: "Somne Divan",
    title: "Why Choose A Somne Divan Bed?",
    items: [
      {
        label: "Storage",
        title: "Engineered for Exceptional Strength with a Reinforced Base",
        body: "Experience effortless organisation with Somne Divan Beds. Designed for modern luxury, choose from 2 or 4 seamlessly integrated drawers that provide generous storage while maintaining a sleek, sophisticated bedroom aesthetic.",
        img: "/img/img7.jpg",
        alt: "Extra Storage Options",
      },
      {
        label: "Craftsmanship",
        title: "Sustainably Sourced & Handcrafted in the UK",
        body: "Somne beds are expertly handcrafted in the UK using the finest solid hardwood sourced from sustainable forests. Built for lasting strength and exceptional support, each bed reflects our commitment to superior craftsmanship and responsible luxury.",
        img: "/img/img5.png",
        alt: "Sustainably Sourced",
      },
      // {
      //   label: "Engineering",
      //   title: "Engineered for Exceptional Strength with a Reinforced Base",
      //   body: "Selecting the right bed base is essential for superior comfort and support. Our reinforced base handles weight up to 100 stone — ideal for couples or families — while the standard base comfortably supports up to 50 stone, without compromising on stability or elegance.",
      //   img: "/img/img6.png",
      //   alt: "Reinforced Base",
      // },
    ],
  },
  upholstered: {
    eyebrow: "Somne Upholstered",
    title: "Why Choose An Upholstered Bed?",
    items: [
      {
        label: "Foundation",
        title: "Durable Foundation for Maximum Stability",
        body: "Our bed frames feature a solid platform base that supports your mattress evenly, extending its lifespan and preventing sagging. Enjoy lasting comfort and reliable support every night.",
        img: "/uphoslstered.jpg",
        alt: "Durable Foundation for Maximum Stability",
      },
      {
        label: "Craftsmanship",
        title: "Sustainably Sourced & Handcrafted in the UK",
        body: "Somne beds are expertly handcrafted in the UK using the finest solid hardwood sourced from sustainable forests. Built for lasting strength and exceptional support, each bed reflects our commitment to superior craftsmanship and responsible luxury.",
        img: "/img/img5.png",
        alt: "Sustainably Sourced",
      },
      // {
      //   label: "Engineering",
      //   title: "Engineered for Exceptional Strength with a Reinforced Base",
      //   body: "Selecting the right bed base is essential for superior comfort and support. Our reinforced base handles weight up to 100 stone — ideal for couples or families — while the standard base comfortably supports up to 50 stone, without compromising on stability or elegance.",
      //   img: "/img/img6.png",
      //   alt: "Reinforced Base",
      // },
    ],
  },
  ottoman: {
    eyebrow: "Somne Ottoman",
    title: "Why Choose A Somne Ottoman Bed?",
    items: [
      {
        label: "Storage",
        title: "Additional Storage for Expanded Capacity",
        body: "Make the most of your bedroom with our ottoman beds, featuring generous under-mattress storage that keeps your essentials neatly tucked away while maintaining exceptional comfort and style.",
        img: "/ottoman.jpg",
        alt: "Additional Storage for Expanded Capacity",
      },
      {
        label: "Craftsmanship",
        title: "Sustainably Sourced & Handcrafted in the UK",
        body: "Somne beds are expertly handcrafted in the UK using the finest solid hardwood sourced from sustainable forests. Built for lasting strength and exceptional support, each bed reflects our commitment to superior craftsmanship and responsible luxury.",
        img: "/img/img5.png",
        alt: "Sustainably Sourced",
      },
      // {
      //   label: "Engineering",
      //   title: "Engineered for Exceptional Strength with a Reinforced Base",
      //   body: "Selecting the right bed base is essential for superior comfort and support. Our reinforced base handles weight up to 100 stone — ideal for couples or families — while the standard base comfortably supports up to 50 stone, without compromising on stability or elegance.",
      //   img: "/img/img6.png",
      //   alt: "Reinforced Base",
      // },
    ],
  },
};

type FeatureItem = {
  label: string;
  title: string;
  body: string;
  img: string;
  alt: string;
};

import { cn } from '@/lib/utils';

const FeatureRow = ({ item, index }: { item: FeatureItem; index: number }) => {
  return (
    <div className="flex flex-col gap-4 group">
      {/* Image on top */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-stone-100">
        <img
          src={item.img}
          alt={item.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" />
      </div>
      
      {/* Content below */}
      <div className="flex flex-col gap-2.5 mt-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-semibold">
          {item.label}
        </p>
        <h3 className="font-serif text-xl md:text-2xl text-stone-900 leading-[1.2]">
          {item.title}
        </h3>
        {/* <p className="text-sm text-justify text-stone-500 leading-relaxed">
          {item.body}
        </p> */}
      </div>
    </div>
  );
};

type BedSectionProps = {
  variant: keyof typeof features;
};

const BedSection = ({ variant }: BedSectionProps) => {
  const { eyebrow, title, items } = features[variant];

  return (
    <section className="bg-[#faf9f7]">
      <div className="section-padding luxury-container">
        {/* Header */}
        {/* <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-3">
            {eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#121212] leading-tight">
            {title}
          </h1>
          <div className="mt-5 mx-auto w-10 h-px bg-stone-300" />
        </div> */}

        {/* Feature rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mt-10">
          {items.map((item, i) => (
            <FeatureRow key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const BedDetails = () => <BedSection variant="divan" />;
export const UpholsteredBedDetails = () => <BedSection variant="upholstered" />;
export const OttomanBedDetails = () => <BedSection variant="ottoman" />;