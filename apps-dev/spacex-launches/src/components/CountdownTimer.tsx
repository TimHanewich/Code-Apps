import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

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
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calcTimeLeft(targetDate)
  );

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="countdown past">T-0 — Launch window reached</span>;
  }

  return (
    <div className="countdown">
      <div className="countdown-segment">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">days</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="countdown-label">hrs</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="countdown-label">min</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-segment">
        <span className="countdown-value">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="countdown-label">sec</span>
      </div>
    </div>
  );
}
