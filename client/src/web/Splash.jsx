import { useEffect, useState } from "react";

export default function Splash({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 400);
    const t3 = setTimeout(() => setStep(3), 750);
    const t4 = setTimeout(() => setStep(4), 1100);
    const t5 = setTimeout(() => setStep(5), 2000);
    const t6 = setTimeout(onDone, 2600);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [onDone]);

  const containerStyle = {
    opacity: step === 5 ? 0 : 1,
    transition: step === 5 ? "opacity 0.5s ease" : "none",
    pointerEvents: "none",
  };

  const wordmarkPlanStyle = {
    opacity: step >= 1 ? 1 : 0,
    transform: step >= 1 ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  const wordmarkOvaStyle = {
    opacity: step >= 2 ? 1 : 0,
    transform: step >= 2 ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  const underlineBarStyle = {
    width: step >= 3 ? "100%" : "0%",
    transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const taglineStyle = {
    opacity: step >= 4 ? 1 : 0,
    transform: step >= 4 ? "translateY(0)" : "translateY(8px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  const progressBarStyle = {
    width: step >= 1 ? "100%" : "0%",
    transition: "width 1.9s cubic-bezier(0.4, 0, 0.6, 1)",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy"
      style={containerStyle}
    >
      {/* Wordmark */}
      <div className="flex items-baseline">
        <span
          className="font-black text-[3rem] sm:text-[3.8rem] tracking-tight text-white leading-none"
          style={wordmarkPlanStyle}
        >
          Plan
        </span>
        <span
          className="font-black text-[3rem] sm:text-[3.8rem] tracking-tight text-accent leading-none"
          style={wordmarkOvaStyle}
        >
          ova
        </span>
      </div>

      {/* Underline */}
      <div className="mt-3 w-[200px] sm:w-[260px] h-[1.5px] bg-white/10 overflow-hidden">
        <div
          className="h-full bg-accent"
          style={underlineBarStyle}
        />
      </div>

      {/* Tagline */}
      <p
        className="mt-3 text-[11px] sm:text-[12px] text-white/30 font-semibold tracking-[0.2em] uppercase"
        style={taglineStyle}
      >
        Expo Management Platform
      </p>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
        <div
          className="h-full bg-accent/50"
          style={progressBarStyle}
        />
      </div>
    </div>
  );
}
