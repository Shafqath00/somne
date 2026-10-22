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
        <section className="bg-white py-10 md:py-14">
            <div className="luxury-container">
                <div className="mb-8 text-center md:mb-16">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/60 md:mb-3 md:text-sm">Need to know</p>
                    <h2 className="text-2xl font-black text-foreground md:text-5xl">Frequently asked questions</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base">
                        Everything you need to know about our products and delivery.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="rounded-2xl border border-gray-300 bg-white px-5 shadow-sm transition-all data-[state=open]:ring-2 data-[state=open]:ring-gray-100 md:rounded-lg md:px-6"
                            >
                                <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground/90 hover:no-underline md:py-6 md:text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground md:pb-6 md:text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
