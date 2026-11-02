// Lifestyle imagery for the storefront. Each scene uses a real Somne bed from the
// catalogue, re-staged in a premium room (generated from the product photo).
export const scenes = {
  heroAmbassador: '/img/revamp/hero-ambassador.jpg',
  amaraEmerald: '/img/revamp/amara-emerald.jpg',
  glasgowMidnight: '/img/revamp/glasgow-midnight.jpg',
  knightsbridgeStorage: '/img/revamp/knightsbridge-storage.jpg',
  lioraMorning: '/img/revamp/liora-morning.jpg',
  mattressCloud: '/img/revamp/mattress-cloud.jpg',
};

export const featuredBeds = {
  ambassador: { name: 'The Ambassador', slug: 'ambassador-upholstered-bed', from: 555 },
  amara: { name: 'Amara Divan', slug: 'amara-divan-bed', from: 420 },
  glasgow: { name: 'Glasgow Sleigh', slug: 'glasgow-upholstered-bed', from: 515 },
  knightsbridge: { name: 'Knightsbridge Ottoman', slug: 'knightsbridge-upholstered-ottoman-bed', from: 534.99 },
  liora: { name: 'Liora Ottoman Divan', slug: 'liora-ottoman-divan-bed', from: 505 },
  mattress: { name: 'Somne 5000 Pillow Top', slug: 'somne-5000-pocket-sprung-pillow-top', from: 529 },
};

// Image + tagline shown in the header mega menu for each top-level nav item
export const navFeatures: Record<string, { image: string; title: string; caption: string; href: string }> = {
  Beds: {
    image: scenes.amaraEmerald,
    title: 'Amara in Emerald',
    caption: 'Chevron velvet, made to order',
    href: `/product/${featuredBeds.amara.slug}`,
  },
  'Ottoman Beds': {
    image: scenes.knightsbridgeStorage,
    title: 'Lift. Store. Sleep.',
    caption: 'Gas-lift storage under every ottoman',
    href: '/beds/upholstered-ottoman-bed',
  },
  Mattresses: {
    image: scenes.mattressCloud,
    title: 'The 5000 Pillow Top',
    caption: '5,000 pocket springs of support',
    href: `/product/${featuredBeds.mattress.slug}`,
  },
};

export const colourStories = [
  { name: 'Emerald', hex: '#0f6b54', image: scenes.amaraEmerald, href: '/beds/divan-beds', bed: featuredBeds.amara },
  { name: 'Midnight', hex: '#1b1a24', image: scenes.glasgowMidnight, href: '/beds/upholstered-beds', bed: featuredBeds.glasgow },
  { name: 'Royal Blue', hex: '#2747a8', image: scenes.knightsbridgeStorage, href: '/beds/upholstered-ottoman-bed', bed: featuredBeds.knightsbridge },
  { name: 'Dove Grey', hex: '#b9bcc4', image: scenes.lioraMorning, href: '/beds/ottoman-divan-beds', bed: featuredBeds.liora },
  { name: 'Champagne', hex: '#d9c3a5', image: scenes.heroAmbassador, href: '/beds/upholstered-beds', bed: featuredBeds.ambassador },
];
