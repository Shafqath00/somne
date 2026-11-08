import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JellyLabsPage() {
  return (
    <div className="flex min-h-screen min-h-[100svh] flex-col bg-[#FAF9F6] font-sans text-[#202024] selection:bg-[#6548C7]/15">
      <header className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
        <div className="inline-flex items-center gap-2.5" aria-label="JellyLabs">
          <img
            src="https://jellylabs.co.uk/assets/jelly-u9Zi8nHe.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-base font-bold tracking-tight">JellyLabs</span>
        </div>
      </header>

      <main className="flex flex-1 items-center px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto w-full max-w-[640px]">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#6548C7]">
            Behind this website
          </p>
          <h1 className="max-w-[600px] font-sans text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-6xl">
            Built and maintained by{' '}
            <span className="text-[#6548C7]">JellyLabs.</span>
          </h1>
          <div className="mt-6 max-w-lg space-y-4 text-base leading-relaxed text-[#62626B] sm:text-lg">
            <p>
              JellyLabs created and built this website, bringing its design
              and code together into the experience you see today.
            </p>
            <p>
              Our work continues beyond launch. We maintain the code behind this
              website, take care of updates, and make improvements to keep it
              running smoothly.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="https://jellylabs.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#6548C7] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5338AD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6548C7]"
            >
              Visit JellyLabs
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm py-2 text-sm font-medium text-[#62626B] transition-colors hover:text-[#202024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6548C7]"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to website
            </Link>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="border-t border-[#202024]/10 py-6 text-xs text-[#62626B] sm:py-8">
          © {new Date().getFullYear()} JellyLabs.
        </div>
      </footer>
    </div>
  );
}
