import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BadgeCheck, CreditCard, Factory, Layers, PackageOpen, Quote, ShieldCheck, Sparkles, Star, Truck, Wind } from 'lucide-react';
import { reviews } from '@/data';
import { colourStories, featuredBeds, scenes } from '@/data/revamp';
import { cn } from '@/lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export function SectionHeading({
  eyebrow,
  title,
  italic,
  className,
  light,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <motion.div {...fadeUp} className={className}>
      <p className={cn('mb-3 text-[11px] font-bold uppercase tracking-[0.26em]', light ? 'text-saffron' : 'text-terracotta')}>
        {eyebrow}
      </p>
      <h2 className={cn('font-display text-4xl leading-[0.98] md:text-6xl', light ? 'text-white' : 'text-ink')}>
        {title} {italic && <em className="font-normal italic text-terracotta">{italic}</em>}
      </h2>
    </motion.div>
  );
}

/* ─────────────────────────── Trust strip ─────────────────────────── */

const TRUST = [
  { icon: Truck, title: 'Free delivery', text: 'Across UK mainland', tone: 'bg-jade/10 text-jade' },
  { icon: Factory, title: 'Handmade in UK', text: 'Built to order', tone: 'bg-terracotta/10 text-terracotta' },
  { icon: ShieldCheck, title: '5-year warranty', text: 'On every frame', tone: 'bg-royal/10 text-royal' },
  { icon: CreditCard, title: 'Pay in 3', text: 'Interest-free with Klarna', tone: 'bg-plum/10 text-plum' },
];

export function TrustStrip() {
  return (
    <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink/5 shadow-medium lg:grid-cols-4">
        {TRUST.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="flex items-center gap-3 bg-white px-4 py-5 sm:gap-4 sm:px-6 sm:py-6">
            <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink sm:text-base">{title}</p>
              <p className="text-xs text-ink/60 sm:text-sm">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── Category bento ─────────────────────────── */

const CATEGORY_TILES = [
  {
    name: 'Upholstered Beds',
    blurb: 'Chesterfield, sleigh & wingback',
    href: '/beds/upholstered-beds',
    image: scenes.glasgowMidnight,
    from: 415,
    span: 'md:col-span-7 md:row-span-2',
    chip: 'bg-saffron text-ink',
  },
  {
    name: 'Divan Beds',
    blurb: 'Classic comfort, endless fabrics',
    href: '/beds/divan-beds',
    image: scenes.amaraEmerald,
    from: 255,
    span: 'md:col-span-5 md:row-span-2',
    chip: 'bg-jade text-white',
  },
  {
    name: 'Ottoman Divans',
    blurb: 'Hidden lift-up storage',
    href: '/beds/ottoman-divan-beds',
    image: scenes.lioraMorning,
    from: 400,
    span: 'md:col-span-4',
    chip: 'bg-lilac text-ink',
  },
  {
    name: 'Upholstered Ottomans',
    blurb: 'Statement frame, secret space',
    href: '/beds/upholstered-ottoman-bed',
    image: scenes.knightsbridgeStorage,
    from: 474.99,
    span: 'md:col-span-4',
    chip: 'bg-royal text-white',
  },
  {
    name: 'Mattresses',
    blurb: 'Pocket sprung to memory foam',
    href: '/mattresses',
    image: scenes.mattressCloud,
    from: 80,
    span: 'md:col-span-4',
    chip: 'bg-terracotta text-white',
  },
];

export function CategoryBento() {
  return (
    <section className="px-4 pb-8 pt-20 sm:px-6 md:pt-28 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <SectionHeading eyebrow="Shop by category" title="Find the bed that" italic="feels like you." />
          <motion.p {...fadeUp} className="max-w-sm text-base leading-relaxed text-ink/65">
            Every Somne bed is made to order in the UK, in your size, your fabric and your colour.
          </motion.p>
        </div>

        <div className="grid auto-rows-[minmax(260px,auto)] grid-cols-1 gap-4 md:auto-rows-[300px] md:grid-cols-12 md:gap-5">
          {CATEGORY_TILES.map((tile, i) => (
            <motion.div key={tile.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className={tile.span}>
              <Link to={tile.href} className="group relative block h-full min-h-[260px] overflow-hidden rounded-[2rem] bg-ink">
                <img
                  src={tile.image}
                  alt={tile.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className={cn('absolute left-5 top-5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]', tile.chip)}>
                  from £{Math.floor(tile.from)}
                </span>
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white md:inset-x-7 md:bottom-7">
                  <div>
                    <h3 className="font-display text-3xl leading-none md:text-4xl">{tile.name}</h3>
                    <p className="mt-2 text-sm text-white/80">{tile.blurb}</p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-saffron">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Offer banner ─────────────────────────── */

export function OfferBanner() {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
      <motion.div
        {...fadeUp}
        className="relative mx-auto grid max-w-[1440px] overflow-hidden rounded-[2.5rem] bg-saffron md:grid-cols-2"
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-saffron">
            <Sparkles className="h-3.5 w-3.5" /> Limited time
          </p>
          <h2 className="font-display text-[3.6rem] leading-[0.88] tracking-[-0.04em] text-ink sm:text-8xl lg:text-[8.5rem]">
            25<span className="text-terracotta">%</span>
            <span className="mt-2 block text-[0.4em] italic leading-tight tracking-normal">off every bed</span>
          </h2>
          <p className="mt-6 max-w-sm text-base text-ink/75 md:text-lg">
            Upgrade the whole set-up for less. Use the code below at checkout, on any bed, any fabric, any size.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-2xl border-2 border-dashed border-ink/40 px-5 py-3 font-mono text-lg font-bold tracking-[0.2em] text-ink">
              SOMNE25
            </span>
            <Link
              to="/beds/divan-beds"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-terracotta"
            >
              Shop the offer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[380px] md:min-h-[560px]">
          <div className="absolute inset-4 overflow-hidden rounded-t-[999px] rounded-b-[2rem] md:inset-8 md:left-0">
            <img src={scenes.amaraEmerald} alt="Amara divan bed in emerald velvet" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <Link
            to={`/product/${featuredBeds.amara.slug}`}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-medium transition-transform hover:scale-105 md:bottom-14"
          >
            <span className="h-3 w-3 rounded-full bg-jade" />
            Amara Divan · from £{featuredBeds.amara.from}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── Shop by colour ─────────────────────────── */

export function ColourStory() {
  const [active, setActive] = useState(0);
  const story = colourStories[active];

  return (
    <section className="overflow-hidden bg-ink py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:px-10">
        <div>
          <SectionHeading light eyebrow="Shop by colour" title="Pick a mood." italic="We'll make the bed." />
          <motion.p {...fadeUp} className="mt-6 max-w-md text-white/70">
            19 hand-picked plush velvets, naples weaves and chenilles. Tap a shade to see it styled.
          </motion.p>

          <div className="mt-10 flex flex-wrap gap-3">
            {colourStories.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className={cn(
                  'group flex items-center gap-3 rounded-full border py-2 pl-2 pr-5 text-sm font-semibold transition-all',
                  i === active ? 'border-white bg-white text-ink' : 'border-white/20 text-white/80 hover:border-white/60'
                )}
                aria-pressed={i === active}
              >
                <span className="h-8 w-8 rounded-full ring-2 ring-white/30" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex items-end justify-between gap-6"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Styled here</p>
                  <p className="mt-1 font-display text-3xl">{story.bed.name}</p>
                  <p className="text-white/70">from £{story.bed.from}</p>
                </div>
                <Link
                  to={`/product/${story.bed.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:bg-saffron hover:text-ink"
                >
                  View bed <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative aspect-[4/5] md:aspect-[5/6]">
          <div className="absolute -inset-6 rounded-[3rem] opacity-40 blur-3xl transition-colors duration-700" style={{ backgroundColor: story.hex }} />
          <AnimatePresence mode="sync">
            <motion.img
              key={story.image}
              src={story.image}
              alt={`${story.bed.name} in ${story.name}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full rounded-[2.5rem] object-cover"
            />
          </AnimatePresence>
          <div className="absolute -bottom-5 -left-3 rounded-3xl bg-white px-5 py-4 text-ink shadow-medium md:-left-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Fabric</p>
            <p className="flex items-center gap-2 font-display text-xl">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: story.hex }} />
              {story.name} Plush
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Storage spotlight ─────────────────────────── */

export function StorageSpotlight() {
  const points = [
    { icon: PackageOpen, title: 'Full-depth storage', text: 'The whole base lifts to reveal the space beneath.' },
    { icon: Wind, title: 'Gas-assisted lift', text: 'Smooth, controlled opening with minimal effort.' },
    { icon: BadgeCheck, title: 'Any fabric, any size', text: 'From small double to super king.' },
  ];
  return (
    <section className="bg-blush/60 px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fadeUp} className="relative order-2 lg:order-1">
          <img
            src={scenes.knightsbridgeStorage}
            alt="Knightsbridge ottoman bed with the storage base lifted"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-medium"
          />
          <div className="absolute -right-2 -top-6 flex h-32 w-32 animate-float flex-col items-center justify-center rounded-full bg-royal text-center text-white shadow-medium md:-right-6 md:h-40 md:w-40">
            <PackageOpen className="h-8 w-8 md:h-10 md:w-10" />
            <span className="mt-2 px-4 text-[10px] font-bold uppercase tracking-[0.16em]">Lift &amp; store</span>
          </div>
        </motion.div>
        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow="Ottoman storage" title="Tidy room." italic="Clear mind." />
          <motion.p {...fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">
            Our ottoman beds lift on gas struts to reveal a full-size storage well, the smartest square metre in the house.
          </motion.p>
          <div className="mt-10 space-y-5">
            {points.map(({ icon: Icon, title, text }, i) => (
              <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 * i }} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-royal shadow-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-ink">{title}</p>
                  <p className="text-ink/65">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/beds/upholstered-ottoman-bed" className="rounded-full bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-royal">
              Upholstered ottomans
            </Link>
            <Link to="/beds/ottoman-divan-beds" className="rounded-full border-2 border-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white">
              Ottoman divans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Mattress feature ─────────────────────────── */

export function MattressFeature() {
  const layers = [
    { label: 'Hand-tufted pillow top', tone: 'bg-white' },
    { label: 'Comfort foam layers', tone: 'bg-blush' },
    { label: '5,000 individual pocket springs', tone: 'bg-saffron' },
    { label: 'Reinforced edge support', tone: 'bg-terracotta' },
  ];
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="The mattress edit" title="Wake up on" italic="cloud nine." />
          <motion.p {...fadeUp} className="mt-6 max-w-md text-lg text-ink/70">
            From supportive orthopaedic to indulgent pillow tops, every Somne mattress is built for the way you sleep.
          </motion.p>
          <div className="mt-10 space-y-2">
            {layers.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3 pr-5"
              >
                <span className={cn('h-10 w-16 rounded-xl border border-ink/10', l.tone)} />
                <span className="font-semibold text-ink">{l.label}</span>
                <Layers className="ml-auto h-4 w-4 text-ink/30" />
              </motion.div>
            ))}
          </div>
          <Link
            to={`/product/${featuredBeds.mattress.slug}`}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink"
          >
            Shop the 5000 Pillow Top <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <motion.div {...fadeUp} className="relative">
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-lilac via-blush to-saffron/40" />
          <img
            src={scenes.mattressCloud}
            alt="Somne 5000 pocket sprung pillow top mattress"
            loading="lazy"
            className="relative aspect-[4/3] w-full rounded-[2.5rem] object-cover"
          />
          <div className="absolute -bottom-6 right-6 rounded-3xl bg-ink px-6 py-4 text-white shadow-medium">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-saffron">From</p>
            <p className="font-display text-4xl">£80</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Reviews ─────────────────────────── */

const REVIEW_TONES = ['bg-blush', 'bg-lilac', 'bg-saffron/40', 'bg-sage/50'];

export function ReviewWall() {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Loved in UK bedrooms" title="Sweet dreams," italic="in their words." />
          <motion.div {...fadeUp} className="flex items-center gap-4">
            <span className="font-display text-6xl text-ink">4.9</span>
            <div>
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-saffron text-saffron" />
                ))}
              </span>
              <p className="text-sm text-ink/60">Average customer rating</p>
            </div>
          </motion.div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((r, i) => (
            <motion.article
              key={r.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={cn('flex flex-col rounded-[2rem] p-7', REVIEW_TONES[i % REVIEW_TONES.length])}
            >
              <Quote className="h-8 w-8 text-ink/80" />
              <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{r.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">“{r.content}”</p>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-bold text-ink">{r.author}</span>
                <span className="flex">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-ink text-ink" />
                  ))}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
