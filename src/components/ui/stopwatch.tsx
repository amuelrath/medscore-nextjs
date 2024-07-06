"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/helpers/utils";

interface StopwatchProps {
  className: string;
  onChange: (elapsedTime: number) => void;
  value: number;
}

export function Stopwatch({ className, onChange, value }: StopwatchProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(value || 0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    onChange(elapsedTime);
  }, [elapsedTime, onChange]);

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return [hours, minutes, seconds]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className={cn("font-mono text-4xl", className)}>
        {formatTime(elapsedTime)}
      </p>
    </div>
  );
}
