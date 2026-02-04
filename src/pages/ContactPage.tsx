import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Thank you for your message! We\'ll be in touch soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Bed Showroom</title>
        <meta 
          name="description" 
          content="Get in touch with Bed Showroom. Call 0800 123 4567 or visit our showroom in London. We're here to help with any questions about our luxury beds and mattresses." 
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-cream mb-4">
              Contact Us
            </h1>
            <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              We're here to help with any questions about our products, delivery, or custom orders.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-8">
                  Contact Details
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Phone</h3>
                      <p className="font-sans text-muted-foreground">0800 123 4567</p>
                      <p className="font-sans text-sm text-muted-foreground">Free from UK landlines</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Email</h3>
                      <p className="font-sans text-muted-foreground">hello@bedshowroom.co.uk</p>
                      <p className="font-sans text-sm text-muted-foreground">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Showroom</h3>
                      <p className="font-sans text-muted-foreground">
                        Bed Showroom<br />
                        123 Craftsman Way<br />
                        London, SW1 2AB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Opening Hours</h3>
                      <p className="font-sans text-muted-foreground">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: 10am - 5pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border p-8 md:p-10">
                  <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
                    Send Us a Message
                  </h2>
                  <p className="font-sans text-muted-foreground mb-8">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                          Your Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="border-border focus:border-accent focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-border focus:border-accent focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-border focus:border-accent focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                        Your Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="How can we help you?"
                        className="border-border focus:border-accent focus:ring-accent"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-16">
              <div className="bg-secondary h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="font-sans text-muted-foreground">Interactive map would display here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ContactPage;
