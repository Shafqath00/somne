import { Sparkles, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const MaintenancePage = () => {
  const [dots, setDots] = useState("");
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    const timer = setTimeout(() => setVisible(true), 80);
    return () => {
      clearInterval(dotInterval);
      clearInterval(timeInterval);
      clearTimeout(timer);
    };
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time
    .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top bar */}
      {/* <header
        className={`fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-4 border-b border-zinc-900 bg-zinc-950 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full bg-amber-300 block"
            style={{ animation: "breathe 2.5s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase">
            Somne Studio
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-700">
          {timeStr}
        </span>
      </header> */}

      {/* Ghost 503 watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <span
          className="font-black text-zinc-900 leading-none"
          style={{ fontSize: "clamp(180px, 32vw, 400px)", letterSpacing: "-0.05em" }}
        >
          503
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-20 relative z-10">
        <div className="w-full max-w-xl text-center space-y-10">

          {/* Status pill */}
          <div
            className={`transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div className="inline-flex items-center gap-2 border border-zinc-800 px-4 py-1.5">
              {/* <span
                className="w-1.5 h-1.5 rounded-full bg-amber-300 block"
                style={{ animation: "breathe 2s ease-in-out infinite" }}
              /> */}
              <span className="font-mono text-[9px] tracking-[0.3em] text-amber-300 uppercase">
                System Maintenance
              </span>
            </div>
          </div>

          {/* Brand + icon */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* <div className="flex justify-center mb-3">
              <div className="relative">
                <Moon
                  className="w-10 h-10 text-zinc-300"
                  strokeWidth={1}
                  style={{ animation: "breathe 4s ease-in-out infinite" }}
                />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-2 animate-bounce" />
              </div>
            </div> */}
            <h1 className="text-8xl md:text-9xl font-serif text-white tracking-tighter leading-none">
              Somne
            </h1>
          </div>

          {/* Thin divider */}
          {/* <div
            className={`flex items-center gap-4 max-w-xs mx-auto transition-all duration-700 delay-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-700 text-sm font-serif">✦</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div> */}

          {/* Message card */}
          <div
            className={`border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-10 space-y-5 transition-all duration-700 delay-[400ms] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-serif font-light text-zinc-100 tracking-wide">
              Crafting a Better Experience
            </h2>
            <p className="font-mono text-xs text-zinc-500 leading-relaxed tracking-wide max-w-sm mx-auto">
              We are upgrading our platform to deliver a more refined sleep experience.
              We'll return shortly{dots}
            </p>
          </div>

          {/* Stats row */}
          {/* <div
            className={`flex justify-center gap-12 transition-all duration-700 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {[
              { label: "Status", value: "Upgrading" },
              { label: "ETA", value: "Shortly" },
              { label: "Priority", value: "High" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-600 uppercase mb-1.5">
                  {item.label}
                </div>
                <div className="font-serif text-sm text-amber-300 tracking-wider">
                  {item.value}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </main>

      {/* Bottom bar */}
      {/* <footer
        className={`fixed bottom-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-4 border-t border-zinc-900 bg-zinc-950 transition-all duration-700 delay-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-700 uppercase">
          © 2025 Somne
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-zinc-700 uppercase">
          {dateStr}
        </span>
      </footer> */}

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;