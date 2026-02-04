import { Helmet } from 'react-helmet-async';
import { Truck, RefreshCw, Shield, Package, Clock, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const DeliveryPage = () => {
  return (
    <>
      <Helmet>
        <title>Delivery & Returns | Bed Showroom</title>
        <meta 
          name="description" 
          content="Free two-man delivery on all orders over £500. Free assembly included. Old bed collection available. Easy returns within 30 days." 
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Customer Service
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-cream mb-4">
              Delivery & Returns
            </h1>
            <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              We make receiving your new bed as easy as choosing it.
            </p>
          </div>
        </section>

        {/* Delivery Info */}
        <section className="section-padding bg-background">
          <div className="luxury-container">
            <div className="max-w-4xl mx-auto">
              {/* Delivery Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-secondary p-6 text-center">
                  <Truck className="w-8 h-8 text-accent mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">Free Delivery</h3>
                  <p className="font-sans text-sm text-muted-foreground">On orders over £500</p>
                </div>
                <div className="bg-secondary p-6 text-center">
                  <Package className="w-8 h-8 text-accent mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">Two-Man Team</h3>
                  <p className="font-sans text-sm text-muted-foreground">Delivery to room of choice</p>
                </div>
                <div className="bg-secondary p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-accent mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">Free Assembly</h3>
                  <p className="font-sans text-sm text-muted-foreground">Set up included</p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="mb-16">
                <h2 className="font-serif text-3xl font-medium text-foreground mb-8">Delivery Information</h2>
                
                <div className="space-y-8">
                  <div className="border-b border-border pb-8">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-serif text-xl font-medium text-foreground mb-3">Delivery Times</h3>
                        <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                          As each bed is handmade to order, please allow the following lead times:
                        </p>
                        <ul className="space-y-2 font-sans text-muted-foreground">
                          <li>• <strong>Divan Beds & Mattresses:</strong> 5-10 working days</li>
                          <li>• <strong>Upholstered Beds:</strong> 7-14 working days</li>
                          <li>• <strong>Ottoman Beds:</strong> 10-14 working days</li>
                          <li>• <strong>Headboards:</strong> 7-10 working days</li>
                          <li>• <strong>Bespoke Orders:</strong> 14-21 working days</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-border pb-8">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-serif text-xl font-medium text-foreground mb-3">Delivery Areas</h3>
                        <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                          We deliver throughout the UK mainland. Delivery charges may apply for:
                        </p>
                        <ul className="space-y-2 font-sans text-muted-foreground">
                          <li>• Scottish Highlands and Islands</li>
                          <li>• Northern Ireland</li>
                          <li>• Channel Islands</li>
                          <li>• Isle of Man</li>
                        </ul>
                        <p className="font-sans text-muted-foreground mt-4">
                          Please contact us for a delivery quote to these areas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-border pb-8">
                    <div className="flex items-start gap-4">
                      <Package className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-serif text-xl font-medium text-foreground mb-3">Old Bed Collection</h3>
                        <p className="font-sans text-muted-foreground leading-relaxed">
                          Need your old bed taken away? Our delivery team can collect your old bed 
                          and mattress for a small additional fee of £50. This includes responsible 
                          disposal and recycling where possible. Please mention this when placing 
                          your order or contact us to add this service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns Policy */}
              <div>
                <h2 className="font-serif text-3xl font-medium text-foreground mb-8">Returns Policy</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-xl font-medium text-foreground mb-3">30-Day Returns</h3>
                      <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                        We want you to be completely happy with your purchase. If for any reason 
                        you're not satisfied, you can return your bed or mattress within 30 days 
                        of delivery for a full refund.
                      </p>
                      <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                        <strong>Conditions:</strong>
                      </p>
                      <ul className="space-y-2 font-sans text-muted-foreground">
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Returns must be arranged within 30 days of delivery</li>
                        <li>• Bespoke items may be subject to a restocking fee</li>
                        <li>• Customer is responsible for return shipping costs</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-secondary p-6">
                    <h3 className="font-serif text-lg font-medium text-foreground mb-3">5-Year Guarantee</h3>
                    <p className="font-sans text-muted-foreground leading-relaxed">
                      All our beds and mattresses come with a comprehensive 5-year guarantee 
                      covering manufacturing defects and structural issues. This guarantee 
                      does not cover normal wear and tear, damage caused by misuse, or issues 
                      arising from improper care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default DeliveryPage;
