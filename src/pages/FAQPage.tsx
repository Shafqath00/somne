import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

const faqs = [
  {
    category: 'Ordering',
    questions: [
      {
        question: 'How long will my order take to arrive?',
        answer: 'As each bed is handmade to order, delivery times vary. Divan beds and mattresses typically take 5-10 working days, upholstered beds 7-14 days, and ottoman beds 10-14 days. Bespoke orders may take 14-21 working days.',
      },
      {
        question: 'Can I customise my bed?',
        answer: 'Absolutely! We offer a bespoke service where you can customise fabric, size, storage options, and even headboard design. Visit our Customize Your Bed page to submit your requirements, or contact us to discuss your ideas.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards, PayPal, and bank transfer. We also offer interest-free payment plans through Klarna and Clearpay for orders over £200.',
      },
      {
        question: 'Can I cancel or change my order?',
        answer: 'Orders can be cancelled or modified within 24 hours of placing them. After this, production may have begun. Please contact us as soon as possible if you need to make changes.',
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        question: 'Is delivery really free?',
        answer: 'Yes! We offer free two-man delivery to UK mainland addresses on orders over £500. Smaller orders have a flat delivery fee of £49. Scottish Highlands, Islands, and Northern Ireland may incur additional charges.',
      },
      {
        question: 'Will you take my old bed away?',
        answer: 'Yes, we offer an old bed and mattress collection service for £50. Our delivery team will remove your old bed and dispose of it responsibly. Please mention this when placing your order.',
      },
      {
        question: 'Do you assemble the bed?',
        answer: 'Yes, our two-man delivery team will carry your new bed to your room of choice and fully assemble it for you at no extra charge. They\'ll also remove all packaging.',
      },
      {
        question: 'Can I choose a delivery date?',
        answer: 'Once your order is ready, our delivery team will contact you to arrange a convenient delivery date. We\'ll give you a morning or afternoon delivery slot and call you on the day with a more precise time.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        question: 'What sizes do you offer?',
        answer: 'We offer Single (90x190cm), Small Double (120x190cm), Double (135x190cm), King (150x200cm), and Super King (180x200cm). Custom sizes are available through our bespoke service.',
      },
      {
        question: 'How firm are your mattresses?',
        answer: 'Our mattresses range from soft to extra firm. Each product page indicates the firmness level. If you\'re unsure, our team can help recommend the best option for your sleep style and preferences.',
      },
      {
        question: 'What materials do you use?',
        answer: 'We use only premium materials including solid kiln-dried hardwood frames, high-density foams, natural fillings like wool and cotton, and luxurious fabrics. All materials are sourced responsibly.',
      },
      {
        question: 'Do your beds require a mattress?',
        answer: 'Our upholstered beds and ottoman beds include a sprung slatted base but require a separate mattress. Divan sets include a mattress. Headboards are sold separately unless specified.',
      },
    ],
  },
  {
    category: 'Returns & Guarantee',
    questions: [
      {
        question: 'What is your returns policy?',
        answer: 'We offer a 30-day returns policy. If you\'re not completely satisfied, you can return unused items in original packaging within 30 days for a full refund. Customer is responsible for return shipping.',
      },
      {
        question: 'What does the 5-year guarantee cover?',
        answer: 'Our 5-year guarantee covers manufacturing defects and structural issues. It does not cover normal wear and tear, accidental damage, or issues arising from improper use or care.',
      },
      {
        question: 'How do I make a warranty claim?',
        answer: 'Contact us with your order number and photos of the issue. Our customer service team will assess the claim and arrange an inspection or replacement if the issue is covered by the guarantee.',
      },
    ],
  },
];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Bed Showroom</title>
        <meta 
          name="description" 
          content="Find answers to common questions about Bed Showroom beds and mattresses, delivery times, payment options, returns policy, and our 5-year guarantee." 
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Help Centre
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-cream mb-4">
              Frequently Asked Questions
            </h1>
            <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              Find answers to our most commonly asked questions below.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="max-w-3xl mx-auto">
              {faqs.map((category) => (
                <div key={category.category} className="mb-12">
                  <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => {
                      const id = `${category.category}-${index}`;
                      const isOpen = openItems.includes(id);
                      return (
                        <div key={id} className="border border-border">
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full p-5 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                          >
                            <span className="font-sans font-medium text-foreground pr-4">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={cn(
                                'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform',
                                isOpen && 'rotate-180'
                              )}
                            />
                          </button>
                          <div
                            className={cn(
                              'overflow-hidden transition-all duration-300',
                              isOpen ? 'max-h-96' : 'max-h-0'
                            )}
                          >
                            <p className="px-5 pb-5 font-sans text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Contact CTA */}
              <div className="bg-secondary p-8 text-center mt-16">
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  Still have questions?
                </h3>
                <p className="font-sans text-muted-foreground mb-4">
                  Our friendly team is here to help.
                </p>
                <p className="font-sans text-foreground">
                  Call us on <strong>0800 123 4567</strong> or email{' '}
                  <a href="mailto:hello@somnus.co.uk" className="text-accent hover:underline">
                    hello@somnus.co.uk
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default FAQPage;
