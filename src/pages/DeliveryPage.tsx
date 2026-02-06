import { Helmet } from 'react-helmet-async';
import { Truck, RefreshCw, Shield, Package, Clock, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const DeliveryPage = () => {
  return (
    <>
      <Helmet>
        <title>Return & Refunds</title>
        <meta
          name="description"
          content="Returns and refunds policy for Somne products."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-10 bg-primary">
          <div className="luxury-container text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
              Customer Service
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-cream mb-4">
              Returns & Refunds
            </h1>
            {/* <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
              We make receiving your new bed as easy as choosing it.
            </p> */}
          </div>
        </section>

        {/* Delivery Info */}
        <section className="section-padding bg-white">
          <div className="luxury-container">
            <div className="max-w-4xl mx-auto">
              {/* Delivery Highlights */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
              </div> */}

              {/* Delivery Details */}
              {/* <div className="mb-16">
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
              </div> */}

              {/* Returns & Refunds Policy */}
              <div>
                <h2 className="font-serif text-3xl font-medium text-foreground mb-8">Returns & Refunds Policy</h2>

                <div className="space-y-8 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    We want you to love your Somne purchase, but we also understand that sometimes things change. Here's everything you need to know about returning items, requesting a refund, or changing your mind.
                  </p>
                  <p>
                    Please note that some items cannot be returned. Scroll down to find out if this affects you.
                  </p>

                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-xl font-medium text-foreground mb-3">Returns Policy</h3>
                      <p className="mb-4">
                        If you wish to return an item, please contact us to begin the process.
                      </p>
                      <div className="bg-secondary p-4 rounded-md text-sm">
                        <p className="font-medium mb-2">Get in touch via:</p>
                        <ul className="space-y-1">
                          <li>Email: support@somne.co.uk</li>
                          <li>Telephone: 01924 926117</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Important Information About Your Return</h3>
                    <p className="mb-4">
                      A £75 collection fee applies if you choose to return an item. This fee will be deducted from your refund. For example, if your item costs £500, you will receive £425 once it's returned in reasonable condition.
                    </p>
                    <p className="mb-4">
                      Alternatively, you are welcome to arrange your own return. Returns must be sent to:
                    </p>
                    <address className="not-italic bg-secondary p-4 rounded-md text-sm mb-4">
                      Somne Group, Alexandra Mills, Alexandra Road, Batley, WF17 6JA.
                    </address>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">To Ensure a Smooth and Hassle-Free Return</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>If the product we receive is damaged (e.g. a torn fabric, stains, or structural damage), or if it's returned in an unreasonable condition after use, we reserve the right to deduct up to 75% of the total amount from your refund to cover the damages.</li>
                      <li>If you’ve selected our assembly service, we can remove the packaging for you, but please note that if you later wish to return the item, you’ll need to source suitable packaging yourself. For this reason, we recommend keeping the original packaging if you plan to test the product before deciding.</li>
                      <li>To arrange a return, we’ll also need you to send us a photo of the item fully packaged and ready for collection.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Damaged Items on Delivery</h3>
                    <p className="mb-4">
                      We take every step to ensure your item arrives in perfect condition. Here’s what to do if something doesn’t look right:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>When receiving your order, we ask that you sign to confirm the item has arrived without visible damage.</li>
                      <li>If you notice any damage after unpacking, please contact us within 48 hours of delivery via email or phone.</li>
                      <li>Any issues reported after 48 hours may not be eligible for a refund or exchange.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Change of Mind</h3>
                    <p className="mb-4">
                      If you've changed your mind about a product, we’re still happy to help, with some conditions:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>A £75 collection fee applies for any change-of-mind return.</li>
                      <li>If you’re exchanging an item (e.g., for a different size or colour), the £75 fee also applies to the collection and delivery of the replacement item.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Items That Don’t Fit</h3>
                    <p className="mb-4">
                      Before placing your order, please ensure that your selected item can be delivered to your home. This includes checking doorways, staircases, hallways, and tight corners.
                    </p>
                    <p>
                      If our delivery team is unable to complete the delivery due to access restrictions, a £75 return fee will apply.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Custom & Made-to-Order Items</h3>
                    <p>
                      For items that are custom-made or built to specific requirements (e.g., non-standard bed or headboard sizes), returns are not accepted. These bespoke items are made especially for you and are non-refundable under all circumstances.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Assembly & Removal Services</h3>
                    <p className="mb-2">If you’ve purchased additional services, please note the following:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Assembly Service:</strong> Standard delivery is to the doorstep or just inside your front door. For apartments, this means ground floor lobby only unless you've selected assembly.</li>
                      <li>If selected, our team will take items to your room of choice if safely accessible.</li>
                      <li>We can only carry items up to two floors via stairs. For floors above the second, a working lift must be available. If not, and assembly was selected, a £75 delivery surcharge will apply.</li>
                      <li>If the item cannot be delivered or assembled due to access issues, the assembly fee is non-refundable.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Refunds: How & When</h3>
                    <p className="mb-4">
                      Once we’ve received the returned item and confirmed it’s in reasonable condition, we’ll process your refund as quickly as possible. Refunds are made using the same payment method used during the purchase. Please allow up to 5 working days for the refund to appear in your account after processing.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Collection Service</h3>
                    <p className="mb-4">
                      <strong>Can you collect the item(s) I want to return?</strong><br />
                      Yes, we offer collection for returns. If your order was delivered by our courier, we can arrange for it to be picked up from your address. A return fee of £75 will apply and will be deducted from your refund.
                    </p>
                    <p>
                      <strong>How long will it take to collect my order?</strong><br />
                      Collections typically take 7–14 working days. We'll keep you updated throughout the process to ensure everything goes smoothly.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3">Cancellations</h3>
                    <p className="mb-4">
                      <strong>Can I cancel my order before a delivery date is arranged?</strong><br />
                      Yes, you can cancel your order anytime before a delivery date has been scheduled. Just contact us at support@somne.co.uk or 01924 926117, and we’ll cancel your order and issue a full refund.
                    </p>
                    <p className="mb-4">
                      <strong>Can I cancel my order after a delivery date has been arranged?</strong><br />
                      Yes, you can still cancel your order after a delivery date has been set. However, a £75 cancellation fee will apply once the delivery date has been confirmed. To avoid this fee, please cancel your order before receiving your delivery date confirmation.
                    </p>
                    <p className="mb-4">
                      <strong>What happens if I miss my delivery?</strong><br />
                      If you’re not available at the time of delivery, a £75 redelivery fee will apply. We’ll then help you reschedule your delivery at a time that suits you.
                    </p>
                    <p className="mb-4">
                      <strong>Can I change my delivery date?</strong><br />
                      Yes, you can rearrange your delivery date. Once your delivery date has been confirmed, you have a 24-hour window to contact us and reschedule at no extra cost. If you request a change after this 24-hour period, a £75 redelivery fee will apply.
                    </p>
                  </div>

                  <div className="bg-secondary p-6 mt-8">
                    <h3 className="font-serif text-lg font-medium text-foreground mb-3">Still have questions?</h3>
                    <p className="font-sans text-muted-foreground leading-relaxed">
                      We’re here to help — feel free to reach out to our support team via email, phone, or the help section on our website.
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
