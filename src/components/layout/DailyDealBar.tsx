import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const DEAL_DURATION_MS = 12 * 60 * 60 * 1000;
const DEAL_STORAGE_KEY = 'somne-daily-deal-end-at';
const DEAL_CODE = 'SOMNE25';

type TimeLeft = { hours: number; minutes: number; seconds: number };

const getFreshEndTime = () => Date.now() + DEAL_DURATION_MS;

const getDealEndTime = () => {
  const storedEndAt = Number(window.localStorage.getItem(DEAL_STORAGE_KEY));
  if (Number.isFinite(storedEndAt) && storedEndAt > Date.now()) return storedEndAt;
  const freshEndAt = getFreshEndTime();
  window.localStorage.setItem(DEAL_STORAGE_KEY, String(freshEndAt));
  return freshEndAt;
};

const splitTimeLeft = (remainingMs: number): TimeLeft => {
  const r = Math.max(0, remainingMs);
  return {
    hours: Math.floor(r / (1000 * 60 * 60)),
    minutes: Math.floor((r / (1000 * 60)) % 60),
    seconds: Math.floor((r / 1000) % 60),
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

export function DailyDealBar() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 12, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let dealEndAt = getDealEndTime();
    const update = () => {
      if (dealEndAt - Date.now() <= 0) {
        dealEndAt = getFreshEndTime();
        window.localStorage.setItem(DEAL_STORAGE_KEY, String(dealEndAt));
      }
      setTimeLeft(splitTimeLeft(dealEndAt - Date.now()));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const copyDealCode = async () => {
    try {
      await navigator.clipboard.writeText(DEAL_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[var(--daily-deal-bar-height)] bg-black border-b border-white/10 flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3 px-4 flex-wrap sm:flex-nowrap sm:gap-5">

        {/* Message */}
        <p className="text-[11px] sm:text-[15px] uppercase tracking-[0.18em] text-white/80 font-bold whitespace-nowrap">
          25% off sitewide — ends in
        </p>

        {/* Countdown */}
        <div className="flex items-center gap-1 font-mono tabular-nums text-[13px] sm:text-[15px] text-white font-bold" aria-label="Offer ends in">
          <span>{pad(timeLeft.hours)}</span>
          <span className="text-white/30 mx-0.5">:</span>
          <span>{pad(timeLeft.minutes)}</span>
          <span className="text-white/30 mx-0.5">:</span>
          <span>{pad(timeLeft.seconds)}</span>
        </div>

        {/* Separator */}
        <span className="hidden sm:block h-3.5 w-px bg-white/15" />

        {/* Code */}
        <button
          type="button"
          onClick={copyDealCode}
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-[15px] uppercase tracking-[0.18em] font-bold transition-colors duration-150 focus:outline-none"
          aria-label={`Copy deal code ${DEAL_CODE}`}
        >
          <span className={copied ? 'text-white/50' : 'text-white'}>
            {DEAL_CODE}
          </span>
          {copied
            ? <Check className="h-3 w-3 text-white/50" />
            : <Copy className="h-3 w-3 text-white/40" />
          }
        </button>

      </div>
    </div>
  );
}