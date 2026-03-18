import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!timeLeft) {
    return <span className="countdown-value">T-0 reached</span>;
  }

  return (
    <div className="countdown">
      <div className="countdown-segment">
        <span className="countdown-value">{pad(timeLeft.days)}</span>
        <span className="countdown-label">days</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">{pad(timeLeft.hours)}</span>
        <span className="countdown-label">hrs</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">{pad(timeLeft.minutes)}</span>
        <span className="countdown-label">min</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">{pad(timeLeft.seconds)}</span>
        <span className="countdown-label">sec</span>
      </div>
    </div>
  );
}
