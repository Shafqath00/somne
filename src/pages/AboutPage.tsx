import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import categoryUpholstered from '@/assets/category-upholstered.jpg';
import categoryDivan from '@/assets/category-divan.jpg';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Bed Showroom</title>
        <meta 
          name="description" 
          content="Discover the story behind Bed Showroom. We're a family-run business handcrafting luxury beds and mattresses in the UK since 2015." 
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-primary">
          <div className="luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-cream mb-6">
              Crafting Dreams<br />Since 2015
            </h1>
            <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              We're a family-run business dedicated to creating the finest 
              handcrafted beds and mattresses in the United Kingdom.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
                  Our Heritage
                </h2>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  Bed Showroom was founded with a simple belief: everyone deserves to experience 
                  the luxury of hotel-quality sleep in their own home. What started as a small 
                  workshop in the English countryside has grown into one of the UK's most 
                  respected bed manufacturers.
                </p>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  Our team of skilled craftsmen bring decades of experience to every piece 
                  they create. Using traditional techniques passed down through generations, 
                  combined with modern design sensibilities, we produce beds that are both 
                  timeless and contemporary.
                </p>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Every bed that leaves our workshop carries the hallmark of British 
                  craftsmanship – attention to detail, quality materials, and a commitment 
                  to excellence that defines everything we do.
                </p>
              </div>
              <div className="relative">
                <img
                  src={categoryUpholstered}
                  alt="Our workshop"
                  className="w-full aspect-[4/3] object-cover shadow-medium"
                />
                <div className="absolute -bottom-6 -right-6 bg-accent p-6 hidden md:block">
                  <p className="font-serif text-4xl text-primary font-medium">9+</p>
                  <p className="font-sans text-sm text-primary/80">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-secondary">
          <div className="luxury-container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                Our Values
              </h2>
              <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we create
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 border border-border">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Quality First
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  We never compromise on materials or craftsmanship. From solid hardwood 
                  frames to hand-selected fabrics, every component meets our exacting standards.
                </p>
              </div>
              <div className="bg-card p-8 border border-border">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Sustainable Practices
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  We source responsibly, minimize waste, and create products built to last. 
                  A Somnus bed is an investment that will serve you for decades.
                </p>
              </div>
              <div className="bg-card p-8 border border-border">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Personal Service
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  As a family business, we treat every customer like family. From your first 
                  enquiry to delivery, you'll experience genuinely personal service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workshop Section */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src={categoryDivan}
                  alt="Craftsman at work"
                  className="w-full aspect-[4/3] object-cover shadow-medium"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
                  Made in Britain
                </h2>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  Our workshop is located in the heart of the English countryside, where 
                  our team of craftsmen bring years of experience to every bed they create. 
                  We're proud to be one of the few remaining manufacturers still producing 
                  entirely in the UK.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-sans text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    All beds handcrafted in our UK workshop
                  </li>
                  <li className="flex items-center gap-3 font-sans text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Locally sourced sustainable materials
                  </li>
                  <li className="flex items-center gap-3 font-sans text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Supporting British manufacturing
                  </li>
                  <li className="flex items-center gap-3 font-sans text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Lower carbon footprint than imports
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AboutPage;
