import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Beds', href: '/beds/divan-beds' },
    { label: 'Mattresses', href: '/mattresses' },
    { label: 'Headboards', href: '/headboards' },
  ],
  help: [
    {label: 'Order Tracking', href: '/track-order'},
    { label: 'Returns & Refunds', href: '/returns' },
    // { label: 'FAQ', href: '/faq' },
    // { label: 'Contact Us', href: '/contact' },
    // { label: 'Blog', href: '/blog' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
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
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  0800 123 4567
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  hello@bedshowroom.co.uk
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  Somne<br />
                  123 Craftsman Way<br />
                  London, SW1 2AB
                </span>
              </li>
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
          {/* <div className="flex gap-6">
            <Link
              to="/privacy"
              className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Terms & Conditions
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
