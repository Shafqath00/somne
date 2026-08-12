import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Beds', href: '/beds/divan-beds' },
    { label: 'Mattresses', href: '/mattresses' },
    { label: 'Headboards', href: '/headboards' },
    { label: 'Panels', href: '/product/acoustic-wall-panel-pack-of-4' },
  ],
  help: [
    { label: 'Order Tracking', href: '/track-order' },
    { label: 'Returns & Refunds', href: '/returns' },
    // { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blogs', href: '/blogs' },
  ],
  company: [
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-primary-foreground">
      {/* Main footer */}
      <div className="luxury-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-6xl font-bold">SOMNE</h1>
            </Link>
            <p className="font-sans text-sm text-primary-foreground/80 leading-relaxed mb-6 max-w-sm">
              Luxury beds and mattresses, handcrafted in the UK. Experience hotel-quality
              comfort in your own home with our premium range of sleep solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/somne_furniture_uk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              {/* <a
                href="https://www.facebook.com/somne.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a> */}
              <a
                href="https://www.tiktok.com/@somne_uk/photo/7390048542276062497?_r=1&u_code=dhhc9i8bdg9k74&preview_pb=0&sharer_language=en&_d=ehc3889dde8j7l&share_item_id=7390048542276062497&source=h5_m&timestamp=1770398812&item_author_type=2&utm_source=whatsapp&tt_from=whatsapp&enable_checksum=1&utm_medium=ios&share_link_id=45375DE4-B31D-499D-A414-D20D2956BDF5&user_id=6941733853464478726&sec_user_id=MS4wLjABAAAAV7t_tVm2E9ZlaYSI2SwWTdjdt_h4zFL6uZsbJdcP5-VqOYYElE5OcmReBmYVm6m2&utm_campaign=client_share&ug_btm=b6880,b2878&social_share_type=14&link_reflow_popup_iteration_sharer=%7B%22click_empty_to_play%22:1,%22dynamic_cover%22:1,%22profile_clickable%22:1,%22follow_to_play_duration%22:-1%7D&ug_photo_idx=0&share_app_id=1233"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 cursor-pointer" onClick={() => window.open('tel:01924906335', '_blank')}>
                <Phone className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  01924 906335
                </span>
              </li>
              <li className="flex items-start gap-3 cursor-pointer" onClick={() => window.open('mailto:contact@somne.co.uk', '_blank')}>
                <Mail className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  contact@somne.co.uk
                </span>
              </li>
              {/* <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  Somne<br />
                  123 Craftsman Way<br />
                  London, SW1 2AB
                </span>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="luxury-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Somne. All rights reserved. Handmade in the United Kingdom.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            {/* <Link
              to="/terms"
              className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Terms & Conditions
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
