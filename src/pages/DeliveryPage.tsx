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
                  <p className="font-sans text-lg text-foreground max-w-2xl">
                    For All Custom Made-to-Order Divan, Upholstered & Ottoman Beds and Mattresses | United Kingdom
                  </p>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">1. Scope & Key Information</h2>
                    <p className="mb-4">This policy applies to all orders placed with Somne. All our beds are fully customisable, handcrafted and manufactured exclusively to your order — we hold no pre-made stock. Every bed is built to your exact selections, including design, dimensions, upholstery colour, storage options (drawers / ottoman mechanism) and any other custom features you choose at checkout.</p>
                    <p className="mb-4">All goods are manufactured and inspected in line with UK consumer rights legislation, including the Consumer Rights Act 2015.</p>
                    <p className="mb-4">Because each piece is made especially for you, we always recommend double-checking your selections — size, colour, storage options and any other custom features — before your order goes into production, as this is the best way to make sure your bed arrives exactly as you imagined it.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">2. Order Cancellation</h2>
                    <p className="mb-4">You can cancel your order at any time <strong>before your delivery date has been scheduled and production has begun</strong>. Just contact us at <a href="mailto:contact@somne.co.uk" className="text-accent underline hover:text-primary transition-colors">contact@somne.co.uk</a> or 01924 906335, and we'll cancel your order and issue a full refund.</p>
                    <p className="mb-4">Once a delivery date has been confirmed and production has started, your order becomes a custom-made item and the cancellation, return and refund terms in Sections 3 and 4 below apply instead — a £75 cancellation fee will apply if you cancel after this point. To avoid this fee, please cancel before your delivery date is confirmed.</p>
                    <p className="mb-4"><strong>Missed delivery:</strong> If you're not available at the time of delivery, a £75 redelivery fee will apply. We'll help you reschedule at a time that suits you.</p>
                    <p className="mb-4"><strong>Changing your delivery date:</strong> Once your delivery date has been confirmed, you have a 24-hour window to contact us and reschedule at no extra cost. Requests made after this window will incur a £75 redelivery fee.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">3. Custom Made-to-Order Beds</h2>
                    <p className="mb-4">Because beds are personalised, handcrafted and produced strictly to your individual requirements:</p>
                    <p className="mb-4">✅ <strong>No general right to cancellation, return or refund applies once production has started.</strong> We do not accept returns for change of mind, incorrect size selection, or preference changes after you have confirmed your order.</p>

                    <h3 className="font-serif text-xl font-medium mt-8 mb-4 text-foreground">Quality & Damage Guarantee</h3>
                    <p className="mb-4">Every bed is triple inspected during manufacture and before leaving our workshop, securely packaged, and double-checked again by our delivery team prior to handover.</p>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>If any part of your bed arrives damaged, faulty, or not matching your confirmed specification, we will manufacture and supply the affected replacement components <strong>free of charge</strong>, arranged for delivery and fitting at a time convenient to you.</li>
                      <li>We will not issue full or partial cash refunds for eligible manufacturing or delivery issues — our remedy is to correct or replace the affected parts.</li>
                      <li>You must report any damage or specification errors within <strong>24 hours of delivery</strong>, providing clear photographs of packaging and affected items (see the reporting rule below).</li>
                    </ul>

                    <h3 className="font-serif text-xl font-medium mt-8 mb-4 text-foreground">📦 Damage & Specification Reporting Rule</h3>
                    <p className="mb-4">You must report any damage, missing parts, or items not matching your confirmed order specification <strong>within 24 hours of delivery</strong>.</p>
                    <p className="mb-2">When contacting us, please provide:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Your full order number</li>
                      <li>Clear photographs of:
                        <ul className="list-circle pl-5 space-y-1 mt-2">
                          <li>All outer packaging and protective wrapping</li>
                          <li>Any affected parts, from all angles</li>
                          <li>Any items that differ from what you ordered</li>
                        </ul>
                      </li>
                      <li>A brief description of the issue</li>
                    </ul>
                    <p className="mb-4">Claims made after this 24-hour window may not be eligible for replacement parts or resolution under this policy.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">4. Mattresses</h2>
                    <p className="mb-4">All mattresses are quality-checked three times before dispatch.</p>
                    <p className="mb-4">✅ <strong>No returns or refunds will be accepted once the sealed original packaging has been opened, torn, broken or tampered with</strong> — this is required for hygiene and product integrity reasons.</p>
                    <p className="mb-4">If a mattress arrives with manufacturing defects or transit damage while still in unopened, undamaged original packaging, we will inspect the claim promptly. Where confirmed, we will either replace the item or offer a proportionate partial refund calculated based on the nature and extent of the issue, at our discretion.</p>
                    <p className="mb-4">All such claims must be made within <strong>24 hours of delivery</strong>. Please notify us of any concerns within this window, keeping all original packaging materials for inspection.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">5. Items That Don't Fit / Access Restrictions</h2>
                    <p className="mb-4">Because every bed is made to order specifically for you, we'd always encourage a little extra care at the planning stage. Before placing your order, please take a moment to measure your doorways, staircases, hallways, and any tight corners along the delivery route, so your new bed reaches its room without a hitch.</p>
                    <p className="mb-4">As each item is manufactured to your personal specification, we're unable to offer a return once production is underway — so this check is very much worth doing in advance. If our delivery team is unable to complete the delivery due to access restrictions, a £75 return fee will also apply.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">6. Assembly & Removal Services</h2>
                    <p className="mb-2">If you've purchased additional services, please note the following:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li><strong>Assembly Service:</strong> Standard delivery is to the doorstep or just inside your front door. For apartments, this means ground-floor lobby only unless you've selected assembly. If selected, our team will take items to your room of choice if safely accessible.</li>
                      <li>We can only carry items up to two floors via stairs. For floors above the second, a working lift must be available. If not, and assembly was selected, a £75 delivery surcharge will apply.</li>
                      <li>If the item cannot be delivered or assembled due to access issues, the assembly fee is non-refundable.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">7. Refund Processing Times</h2>
                    <p className="mb-4">Where a refund is agreed under this policy (for example, a partial mattress refund), we submit it to your original payment method immediately once approved. After that, the timeline is controlled by the card networks and your bank.</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li><strong>Refund reference (ARN):</strong> For card refunds, a tracking reference called an Acquirer Reference Number (ARN) is usually generated within 1–3 business days after the refund is initiated.</li>
                      <li><strong>When you'll receive the money:</strong> Most refunds appear within 5–10 business days, depending on your bank and card provider.</li>
                      <li><strong>Weekends & bank holidays:</strong> Business days exclude weekends and bank holidays, so refunds may take longer during those periods.</li>
                      <li><strong>How refunds appear:</strong> Refunds typically return to the same card/bank account used for the purchase, either as a separate "Refund" transaction or as an adjustment/credit against the original transaction.</li>
                    </ul>
                    <p className="mb-4">If you haven't received your refund after 10 business days, contact us and we'll share the ARN (if available) so your bank can trace it.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">8. Your Statutory Rights</h2>
                    {/* <p className="mb-4"><em>[Placeholder — not specified in the content provided. Suggested wording below for review, ideally by a UK IP/consumer solicitor, before publishing:]</em></p> */}
                    <p className="mb-4">Nothing in this policy affects your statutory rights under the Consumer Rights Act 2015. If goods are faulty, not as described, or not fit for purpose, you may be entitled to a repair, replacement, price reduction, or refund as set out in that Act, regardless of the remedies described above.</p>
                    <p className="mb-4">Because your bed is made to your specification, the standard 14-day "change of mind" cancellation right under the Consumer Contracts Regulations 2013 does not apply to bespoke/personalised goods — this is why Section 3 states that change-of-mind returns are not accepted once production has started.</p>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-medium mt-10 mb-4 text-foreground">9. How to Contact Us</h2>
                    <p className="mb-4">To report damage or raise a query:</p>
                    <ul className="list-none space-y-2 mb-4">
                      <li>📧 Email: <a href="mailto:contact@somne.co.uk" className="text-accent underline hover:text-primary transition-colors">contact@somne.co.uk</a></li>
                      <li>📞 Phone: 01924 906335</li>
                    </ul>
                    <p className="mb-4">Please include your order number, full name, delivery address and clear photos of any packaging or damage with your message.</p>
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
