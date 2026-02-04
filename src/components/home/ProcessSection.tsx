import { processSteps } from '@/data';

export function ProcessSection() {
    return (
        <section className="section-padding bg-secondary">
            <div className="luxury-container">
                <div className="text-center mb-12 md:mb-16">
                    <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
                        How It Works
                    </span>
                    <h2 className="luxury-heading text-foreground mb-4">
                        Our Simple Process
                    </h2>
                    <p className="md:luxury-body text-sm max-w-2xl mx-auto">
                        From browsing to bedroom, we make buying your perfect bed effortless.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 rounded-md gap-8 md:gap-12">
                    {processSteps.map((step, index) => (
                        <div key={step.step} className="relative text-center">
                            {/* Connector line */}
                            {index < processSteps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-border" />
                            )}

                            {/* Step number */}
                            <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full text-primary font-serif text-2xl font-medium flex items-center justify-center">
                                {step.step}
                            </div>

                            <h3 className="font-serif text-xl font-medium text-foreground mb-3">{step.title}</h3>
                            <p className="font-sans text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
