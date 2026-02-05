import { Award, Hammer, Heart, Headphones } from 'lucide-react';

const reasons = [
  {
    icon: Hammer,
    title: 'Handmade in the UK',
    description: 'Every bed is crafted by skilled artisans in our British workshop, using traditional techniques passed down through generations.',
  },
  {
    icon: Award,
    title: 'Premium Materials',
    description: 'We source only the finest materials – from solid hardwood frames to luxurious natural fillings and premium fabrics.',
  },
  {
    icon: Heart,
    title: 'Made for You',
    description: 'Each piece is made to order, allowing for customization of size, fabric, and features to perfectly suit your needs.',
  },
  {
    icon: Headphones,
    title: 'Exceptional Service',
    description: 'From first enquiry to final delivery, our dedicated team ensures a seamless and personal experience.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
            Our Promise
          </span>
          <h2 className="luxury-heading text-foreground mb-4">
            Why Choose Somne
          </h2>
          <p className="md:luxury-body text-sm max-w-2xl mx-auto">
            We believe that exceptional sleep starts with exceptional craftsmanship.
            Here's what sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 flex items-center rounded-full justify-center group-hover:bg-accent transition-colors duration-300">
                <reason.icon className="w-7 h-7 text-accent group-hover:text-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3">{reason.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
