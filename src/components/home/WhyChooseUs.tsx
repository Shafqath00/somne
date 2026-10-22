import { Award, Hammer, Headphones, Heart } from 'lucide-react';

const reasons = [
  {
    icon: Hammer,
    title: 'Handmade in the UK',
    description: 'Built with care, sturdy materials and upholstery details that feel considered from the first night.',
  },
  {
    icon: Award,
    title: 'Premium materials',
    description: 'Supportive frames, soft-touch fabrics and comfort layers selected for long-term everyday use.',
  },
  {
    icon: Heart,
    title: 'Made for your room',
    description: 'Choose sizes, storage and finishes that work for the way your bedroom is really used.',
  },
  {
    icon: Headphones,
    title: 'Helpful service',
    description: 'From first question to delivery updates, the Somne team keeps the process clear and simple.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-black py-10 text-white md:py-14">
      <div className="luxury-container">
        {/* <div className="mb-8 grid gap-5 md:mb-14 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 md:mb-3 md:text-sm">
              Why choose Somne
            </p>
            <h2 className="text-2xl font-black text-white md:text-5xl">
              Confidence included in every package.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            Buying a complete bed setup online should feel straightforward. Somne keeps the essentials visible: practical options, honest comfort, careful making and support when you need it.
          </p>
        </div> */}

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/12 md:grid-cols-2 md:rounded-lg lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="group bg-zinc-950 p-5 md:p-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-black transition-colors duration-300 group-hover:bg-zinc-200 md:mb-7 md:h-12 md:w-12">
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
