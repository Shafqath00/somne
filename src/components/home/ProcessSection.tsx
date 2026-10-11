import { ArrowRight } from 'lucide-react';
import { processSteps } from '@/data';

export function ProcessSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="luxury-container">
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/60 md:mb-3 md:text-sm">How it works</p>
            <h2 className="max-w-2xl text-2xl font-black text-foreground md:text-5xl">
              From package choice to bedroom, kept simple.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground md:text-base">
            Pick your product, checkout securely, then we keep you updated before delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.step} className="rounded-2xl border border-black/10 bg-[#f4f4f4] p-5 md:rounded-lg md:p-8">
              <div className="mb-6 flex items-center justify-between md:mb-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-lg font-black text-white md:h-12 md:w-12 md:text-xl">
                  {step.step}
                </span>
                <ArrowRight className="hidden h-5 w-5 text-muted-foreground md:block" />
              </div>
              <h3 className="text-2xl font-black text-foreground">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
