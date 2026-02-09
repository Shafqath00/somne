import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, CheckCircle, Copy } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { submitContactForm } from '@/api/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitContactForm(formData);
      setSubmittedToken(response.refNo);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToken = () => {
    if (submittedToken) {
      navigator.clipboard.writeText(submittedToken);
      toast.success('Token copied to clipboard!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Somne</title>
        <meta
          name="description"
          content="Get in touch with Somne. Call 0800 123 4567 or visit our Somne in London. We're here to help with any questions about our luxury beds and mattresses."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-10 bg-primary">
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
        <section className="section-padding bg-white">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-8">
                  Contact Details
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white border border-border shadow-md flex items-center rounded-lg justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Phone</h3>
                      <p className="font-sans text-muted-foreground">0800 123 4567</p>
                      <p className="font-sans text-sm text-muted-foreground">Free from UK landlines</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white border border-border shadow-md rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Email</h3>
                      <p className="font-sans text-muted-foreground">hello@somne.co.uk</p>
                      <p className="font-sans text-sm text-muted-foreground">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white border border-border shadow-md rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground mb-1">Somne</h3>
                      <p className="font-sans text-muted-foreground">
                        Somne<br />
                        123 Craftsman Way<br />
                        London, SW1 2AB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white border border-border shadow-md rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="bg-white border rounded-xl shadow-md border-border p-8 md:p-10">
                  {submittedToken ? (
                    // Success State with Token
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
                        Message Sent Successfully!
                      </h2>
                      <p className="font-sans text-muted-foreground mb-6">
                        We've received your inquiry and will get back to you within 24 hours.
                      </p>

                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 max-w-md mx-auto mb-6">
                        <p className="font-sans text-sm text-muted-foreground mb-2">Your Token Number</p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="font-mono text-3xl font-bold text-primary tracking-wider">
                            {submittedToken}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToken}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </Button>
                        </div>
                        <p className="font-sans text-xs text-muted-foreground mt-3">
                          Please save this token for future reference. You'll also receive a confirmation email.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setSubmittedToken(null)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    // Form State
                    <>
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
                              className="border-border rounded-lg "
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
                              className="border-border rounded-lg"
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
                            className="border-border rounded-lg"
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
                            className="border-border bg-white rounded-lg"
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="luxury"
                          className='rounded-lg'
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    </>
                  )}
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
