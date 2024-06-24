'use client'
import { useState, useEffect, FC } from 'react';
import { cn } from "@/lib/utils";

interface StopwatchProps {
  className: string
}

export function Stopwatch ({ className }: StopwatchProps)  {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(Math.floor((currentTime - startTime) / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return [hours, minutes, seconds]
      .map(unit => unit.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className={cn("text-4xl font-mono", className)}>{formatTime(elapsedTime)}</p>
    </div>
  );
};

