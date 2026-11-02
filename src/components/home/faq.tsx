import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Do your products meet UK fire safety standards?",
        answer: "Yes, your safety matters to us. All of our products are manufactured to meet the required UK fire safety standards."
    },
    {
        question: "How long will it take to receive my order after placing it?",
        answer: "We aim to deliver orders within 7–14 working days, excluding bank holidays. Around 3–4 days before delivery, you’ll receive a tracking link confirming your exact delivery date along with the allocated time window."
    },
    {
        question: "Can I select a specific delivery date or time?",
        answer: "At this time, we’re unable to offer the option to choose an exact delivery date or time. Delivery schedules are determined by factors such as logistics planning, route availability, and operational capacity. That said, our priority is to deliver your order as efficiently as possible, and our delivery team will always aim to arrange a convenient delivery window for you."
    },
    {
        question: "What is included in the 5-year warranty?",
        answer: "All of our products are backed by a comprehensive 5-year warranty, reflecting our confidence in their quality and workmanship.If you encounter any issues or have concerns during the warranty period, our customer support team is here to help. We’ll work quickly to resolve the matter, whether that means arranging a repair, a replacement, or an appropriate solution."
    },
    {
        question: "Do you offer removal of old beds or mattresses?",
        answer: "At present, we do not provide a removal service for old beds or mattresses.We recommend contacting your local council, as they often offer a convenient and cost-effective collection service for disposing of unwanted furniture.",
    },
    // {
    //     question: "How long do refunds take?",
    //     answer: "Most refunds take 5–10 business days to appear in your account after we process them. Some banks may take longer."
    // },
    // {
    //     question: "What is an ARN and when will it be available?",
    //     answer: "An ARN (Acquirer Reference Number) is a tracking number used by card networks and banks to locate a refund. It usually becomes available 1–3 business days after the refund is initiated."
    // },
    // {
    //     question: "Can I track my refund?",
    //     answer: "Yes. Once the ARN is available, your bank/card provider can use it to trace the refund. If you ask us, we can share the ARN as soon as it’s generated."
    // },
    // {
    //     question: "Why does it say “refunded” but I haven’t received it yet?",
    //     answer: "“Refunded” means the refund has been successfully sent to the payment network. The remaining time is your bank’s processing time, which is usually 5–10 business days."
    // },
    {
        question: "Do weekends and holidays count?",
        answer: "No. Refund timelines are in business days (excluding weekends and bank holidays). This can extend the wait time."
    },
    {
        question: "What if my card is closed or replaced?",
        answer: "Banks typically route refunds to your updated account automatically, but it depends on the bank. If your card is closed, contact your bank—if needed, we can provide the ARN to help them locate it."
    },
    {
        question: "What should I do if it’s been more than 10 business days?",
        answer: "Message us with: your order/payment email, the last 4 digits of the card (if applicable), and purchase date/amount. We’ll confirm the refund details and provide the ARN (if available) so your bank can trace it."
    },

];

export function FAQSection() {
    return (
        <section className="bg-lilac/50 px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <div className="lg:sticky lg:top-40 lg:self-start">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-terracotta">Need to know</p>
                    <h2 className="font-display text-4xl leading-[0.98] text-ink md:text-6xl">
                        Questions, <em className="italic text-terracotta">answered.</em>
                    </h2>
                    <p className="mt-5 max-w-sm text-ink/65">
                        Everything you need to know about our beds, delivery and warranty. Still curious? We're one message away.
                    </p>
                    <a
                        href="mailto:contact@somne.co.uk"
                        className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-terracotta"
                    >
                        Ask the team
                    </a>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="rounded-3xl border-0 bg-white px-6 shadow-soft transition-all data-[state=open]:shadow-medium md:px-8"
                        >
                            <AccordionTrigger className="py-6 text-left font-display text-lg text-ink hover:no-underline md:text-xl">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-[15px] leading-relaxed text-ink/70">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
