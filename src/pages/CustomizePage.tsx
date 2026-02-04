import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import categoryHeadboard from '@/assets/category-headboard.jpg';

const sizes = ['Single', 'Small Double', 'Double', 'King', 'Super King', 'Custom'];

const CustomizePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bedSize: '',
    notes: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Thank you! We will be in touch within 24 hours.');
    setFormData({ name: '', email: '', phone: '', bedSize: '', notes: '' });
    setImages([]);
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Customize Your Bed | Bed Showroom</title>
        <meta 
          name="description" 
          content="Create your dream bespoke bed. Send us your inspiration photos and we'll handcraft a custom bed or headboard to your exact specifications." 
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={categoryHeadboard} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Bespoke Service
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-cream mb-6">
              Customize Your Dream Bed
            </h1>
            <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              Have a specific design in mind? Share your inspiration and our skilled craftsmen 
              will bring your vision to life.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border p-8 md:p-12">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-2 text-center">
                  Tell Us About Your Dream Bed
                </h2>
                <p className="font-sans text-muted-foreground text-center mb-8">
                  Fill out the form below and we'll get back to you within 24 hours with a quote.
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        Bed Size *
                      </label>
                      <select
                        name="bedSize"
                        value={formData.bedSize}
                        onChange={(e) => setFormData({ ...formData, bedSize: e.target.value })}
                        required
                        className="w-full h-10 px-3 border border-border bg-background font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="">Select a size</option>
                        {sizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                      Reference Images
                    </label>
                    <div className="border-2 border-dashed border-border p-8 text-center hover:border-accent transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                      <p className="font-sans text-sm text-muted-foreground mb-1">
                        Drag & drop images or click to upload
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                    {images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1.5 text-sm font-sans">
                            <Check className="w-4 h-4 text-accent" />
                            {image.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-sm font-medium text-foreground mb-2 block">
                      Your Requirements *
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please describe your ideal bed - style, fabric preferences, headboard design, storage requirements, etc."
                      className="border-border focus:border-accent focus:ring-accent"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </Button>

                  <p className="font-sans text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Privacy Policy. 
                    We'll never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default CustomizePage;
