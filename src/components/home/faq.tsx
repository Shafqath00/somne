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
    }
    // {
    //     question: "Do you offer finance options?",
    //     answer: "Yes, we partner with Klarna and Clearpay to offer flexible payment options, allowing you to spread the cost of your purchase over time interest-free."
    // }
];

export function FAQSection() {
    return (
        <section className="py-16 bg-white">
            <div className="luxury-container">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="luxury-heading text-foreground">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Everything you need to know about our products and delivery.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-gray-300 rounded-xl px-6 bg-white shadow-sm data-[state=open]:ring-2 data-[state=open]:ring-gray-100 transition-all"
                            >
                                <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline font-semibold py-6 text-foreground/90">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
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