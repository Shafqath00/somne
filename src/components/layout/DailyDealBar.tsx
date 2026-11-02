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

  const messages = [
    'Free UK mainland delivery',
    'Handmade in Britain',
    '5-year frame warranty',
    'Spread the cost with Klarna',
    // '19 velvet & chenille fabrics',
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-[var(--daily-deal-bar-height)] items-center overflow-hidden bg-gradient-to-r from-plum via-terracotta-deep to-terracotta text-white">
      {/* Offer + countdown + code */}
      <div className="relative z-10 flex h-full shrink-0 items-center gap-2.5 bg-ink px-3 sm:gap-4 sm:px-5">
        <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-saffron sm:inline">25% off beds</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron sm:hidden">25% off</span>
        <span className="flex items-center gap-0.5 font-mono text-[12px] font-bold tabular-nums" aria-label="Offer ends in">
          {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((v, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <span className="mx-0.5 text-white/40">:</span>}
              <span className="rounded bg-white/10 px-1 py-0.5">{pad(v)}</span>
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={copyDealCode}
          className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink transition-transform hover:scale-105"
          aria-label={`Copy deal code ${DEAL_CODE}`}
        >
          {DEAL_CODE}
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
        <span className="absolute -right-3 top-0 h-full w-3 bg-gradient-to-r from-ink to-transparent" aria-hidden />
      </div>

      {/* Scrolling USPs */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
          {[...messages, ...messages, ...messages, ...messages].map((m, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
              {m}
              <span className="h-1 w-1 rounded-full bg-saffron" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
