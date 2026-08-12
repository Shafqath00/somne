import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';

const PolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Somne</title>
                <meta
                    name="description"
                    content="Privacy Policy for Somne. Learn how we collect, use, store, and share your data when you visit or purchase from somne.co.uk."
                />
            </Helmet>
            <Layout>
                {/* Hero */}
                <section className="py-10 bg-primary">
                    <div className="luxury-container text-center">
                        <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
                            Legal
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl font-medium text-cream mb-4">
                            Privacy Policy
                        </h1>
                        <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
                            Last updated: 15 February 2026
                        </p>
                    </div>
                </section>

                {/* Policy Content */}
                <section className="section-padding bg-white">
                    <div className="luxury-container max-w-4xl mx-auto">
                        <div className="prose prose-lg mx-auto text-foreground font-sans">
                            <p>
                                Somne ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your data when you visit or purchase from <a href="http://somne.co.uk/" className="text-accent underline hover:text-primary transition-colors">somne.co.uk</a>.
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">1. WHO WE ARE (DATA CONTROLLER)</h2>
                            <p>
                                Somne is the data controller for personal data collected via <a href="http://somne.co.uk/" className="text-accent underline hover:text-primary transition-colors">somne.co.uk</a>.
                                <br /><br />
                                <strong>Email:</strong> <a href="mailto:contact@somne.co.uk" className="text-accent underline hover:text-primary transition-colors">contact@somne.co.uk</a>
                                <br />
                                <strong>Phone:</strong> 01924 906335
                                <br />
                                <strong>Business address:</strong> 8 Dobcroft Road, Sheffield, South Yorkshire, United Kingdom, S7 2LR
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">2. WHAT DATA WE COLLECT</h2>
                            <p>We may collect and process the following categories of personal data:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li><strong>Identity data:</strong> name</li>
                                <li><strong>Contact data:</strong> email address, phone number, billing and delivery address</li>
                                <li><strong>Order data:</strong> products purchased, order history, order notes, delivery details</li>
                                <li><strong>Payment data:</strong> payment confirmation and transaction references (we do not store full card details)</li>
                                <li><strong>Customer support data:</strong> messages, emails, call notes, images you send (e.g., damage claims)</li>
                                <li><strong>Technical data:</strong> IP address, browser type, device information, cookies and usage data</li>
                                <li><strong>Marketing preferences:</strong> your communication preferences and opt-in/opt-out choices</li>
                            </ul>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">3. HOW WE USE YOUR DATA</h2>
                            <p>We use your personal data to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Process orders, payments, delivery and returns</li>
                                <li>Provide customer support and manage warranties/complaints</li>
                                <li>Communicate order updates and service messages</li>
                                <li>Prevent fraud, keep the website secure, and protect customers</li>
                                <li>Improve our website, products, and customer experience</li>
                                <li>Send marketing communications (only where permitted and based on your preferences)</li>
                                <li>Comply with legal and tax obligations</li>
                            </ul>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">4. LAWFUL BASES FOR PROCESSING</h2>
                            <p>We process personal data under one or more of these lawful bases:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li><strong>Contract:</strong> to perform the contract when you place an order</li>
                                <li><strong>Legal obligation:</strong> to meet legal and accounting requirements</li>
                                <li><strong>Legitimate interests:</strong> to operate and improve our business, prevent fraud, and provide customer service</li>
                                <li><strong>Consent:</strong> for certain marketing communications and cookie categories where required</li>
                            </ul>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">5. WHO WE SHARE DATA WITH</h2>
                            <p>We may share your data with trusted third parties only as necessary, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Payment processors and checkout providers (e.g., Stripe and others shown at checkout)</li>
                                <li>Delivery/logistics partners and couriers</li>
                                <li>Customer support systems (helpdesk, email tools)</li>
                                <li>Website hosting and e-commerce platform providers</li>
                                <li>Analytics and marketing partners (where enabled by your cookie/marketing preferences)</li>
                            </ul>
                            <p>These providers are required to protect your data and only use it to provide services to us.</p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">6. INTERNATIONAL TRANSFERS</h2>
                            <p>
                                Some service providers may process data outside the UK. Where this happens, we ensure appropriate safeguards are in place to protect your data.
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">7. DATA RETENTION</h2>
                            <p>
                                We keep personal data only for as long as necessary for the purposes described in this Policy, including legal, tax, and accounting requirements.
                                <br /><br />
                                Typical examples:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li><strong>Order and invoice records:</strong> retained as required by law/accounting rules</li>
                                <li><strong>Customer support records:</strong> retained for a limited period to resolve issues</li>
                                <li><strong>Marketing data:</strong> kept until you unsubscribe or request deletion (where applicable)</li>
                            </ul>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">8. YOUR RIGHTS</h2>
                            <p>You have rights under UK data protection law, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li><strong>Access:</strong> request a copy of your personal data</li>
                                <li><strong>Rectification:</strong> correct inaccurate or incomplete data</li>
                                <li><strong>Erasure:</strong> request deletion in certain circumstances</li>
                                <li><strong>Restriction:</strong> request limitation of processing in certain circumstances</li>
                                <li><strong>Objection:</strong> object to certain processing based on legitimate interests</li>
                                <li><strong>Data portability:</strong> request transfer of data where applicable</li>
                                <li><strong>Withdraw consent:</strong> where processing is based on consent, you can withdraw it at any time</li>
                            </ul>
                            <p>
                                To exercise your rights, contact: <a href="mailto:contact@somne.co.uk" className="text-accent underline hover:text-primary transition-colors">contact@somne.co.uk</a>
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">9. COOKIES</h2>
                            <p>
                                We use cookies and similar technologies to make our website work, remember preferences, measure performance, and (where enabled) support marketing.
                                <br /><br />
                                You can control cookies through your browser settings and through any cookie banner/preferences tool on our site (if available).
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">10. SECURITY</h2>
                            <p>
                                We take reasonable steps to protect your personal data using appropriate security measures. No method of transmission over the internet is completely secure, but we work to protect your information.
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">11. COMPLAINTS</h2>
                            <p>
                                If you have concerns about how we handle your data, contact us first at <a href="mailto:contact@somne.co.uk" className="text-accent underline hover:text-primary transition-colors">contact@somne.co.uk</a> and we will try to resolve it.
                                <br /><br />
                                You also have the right to lodge a complaint with the UK Information Commissioner’s Office (ICO).
                            </p>

                            <h2 className="font-serif text-2xl font-medium mt-10 mb-4">12. CHANGES TO THIS POLICY</h2>
                            <p>
                                We may update this Privacy Policy from time to time. The latest version will always be published on <a href="http://somne.co.uk/" className="text-accent underline hover:text-primary transition-colors">somne.co.uk</a>.
                            </p>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default PolicyPage;
