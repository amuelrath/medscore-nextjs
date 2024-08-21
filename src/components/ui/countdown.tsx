"use client";
import React, { useCallback, useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string | Date;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
}) => {
  const calculateTimeLeft = useCallback(():
    | TimeLeft
    | Record<string, never> => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return {};
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | Record<string, never>>(
    calculateTimeLeft(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const addLeadingZero = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const renderTimeLeft = (): string => {
    const timeComponents: string[] = [];

    if ("days" in timeLeft) {
      if (showDays && timeLeft.days > 0) {
        timeComponents.push(`${timeLeft.days}d`);
      }
      if (showHours && (timeLeft.hours > 0 || timeLeft.days > 0)) {
        timeComponents.push(`${addLeadingZero(timeLeft.hours)}h`);
      }
      if (
        showMinutes &&
        (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0)
      ) {
        timeComponents.push(`${addLeadingZero(timeLeft.minutes)}m`);
      }
      if (showSeconds) {
        timeComponents.push(`${addLeadingZero(timeLeft.seconds)}s`);
      }
    }

    return timeComponents.join(" ");
  };

  return (
    <div className="text-sm">
      {Object.keys(timeLeft).length === 0 ? (
        <span>Expired</span>
      ) : (
        renderTimeLeft()
      )}
    </div>
  );
};
