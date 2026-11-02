import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, ArrowUpRight, Truck, ShieldCheck, Factory } from 'lucide-react';
import { scenes } from '@/data/revamp';

const footerLinks = {
  shop: [
    { label: 'Divan Beds', href: '/beds/divan-beds' },
    { label: 'Upholstered Beds', href: '/beds/upholstered-beds' },
    { label: 'Ottoman Beds', href: '/beds/ottoman-divan-beds' },
    { label: 'Mattresses', href: '/mattresses' },
    { label: 'Headboards', href: '/headboards' },
    { label: 'Panels', href: '/product/acoustic-wall-panel-pack-of-4' },
  ],
  help: [
    { label: 'Order Tracking', href: '/track-order' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const TIKTOK_URL = 'https://www.tiktok.com/@somne_uk';
const INSTAGRAM_URL = 'https://www.instagram.com/somne_furniture_uk';

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Image band with CTA */}
      <div className="px-4 pt-4 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2.5rem]">
          <img src={scenes.lioraMorning} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_60%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-plum/60 to-transparent" />
          <div className="relative flex flex-col gap-8 px-8 py-14 md:flex-row md:items-end md:justify-between md:px-14 md:py-20">
            <div className="max-w-xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Made to order in Britain</p>
              <h2 className="font-display text-4xl leading-[0.98] md:text-6xl">
                Your dream bed is <em className="italic text-saffron">one click</em> away.
              </h2>
            </div>
            <Link
              to="/beds/upholstered-beds"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-saffron"
            >
              Start shopping <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 md:py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-white/65">
              Luxury beds and mattresses, handcrafted in the UK. Hotel-quality comfort in 19 colourful fabrics, delivered free to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              {[
                { icon: Truck, label: 'Free delivery' },
                { icon: Factory, label: 'Made in UK' },
                { icon: ShieldCheck, label: '5-year warranty' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white/80">
                  <Icon className="h-4 w-4 text-saffron" /> {label}
                </span>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-terracotta">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-terracotta">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-saffron">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/75 transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-saffron">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/75 transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-saffron">Talk to us</h3>
            <a href="tel:01924906335" className="flex items-center gap-3 font-display text-2xl transition-colors hover:text-saffron">
              <Phone className="h-5 w-5 text-terracotta" /> 01924 906335
            </a>
            <a href="mailto:contact@somne.co.uk" className="mt-3 flex items-center gap-3 text-white/75 transition-colors hover:text-white">
              <Mail className="h-5 w-5 text-terracotta" /> contact@somne.co.uk
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-4 sm:px-6 lg:px-10" aria-hidden>
        <p className="mx-auto max-w-[1440px] select-none bg-gradient-to-r from-terracotta via-saffron to-lilac bg-clip-text font-display text-[24vw] font-semibold italic leading-[0.8] tracking-[-0.06em] text-transparent lg:text-[19rem]">
          somne
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:px-6 md:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Somne. All rights reserved. Handmade in the United Kingdom.</p>
          <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
