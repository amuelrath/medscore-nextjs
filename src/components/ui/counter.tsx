import React, { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  type?: "percent" | "number";
}

const easeOutCubic = (t: number, b: number, c: number, d: number) => {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
};

const Counter: React.FC<CounterProps> = ({
                                           value,
                                           duration = 1,
                                           className,
                                           type = "number"
                                         }) => {
  const [count, setCount] = useState(0);
  const animationIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      startTimeRef.current = performance.now();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const elapsed = Math.min(progress / (duration * 1000), 1);
      const countValue = easeOutCubic(elapsed, count, value - count, 1);

      setCount(countValue);

      if (elapsed < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [value, duration]);

  const formatCount = () => {
    const fixedCount = count.toFixed(type === "percent" ? 0 : 1);
    const paddedCount = fixedCount.toString().padStart(2, "0");
    return type === "percent" ? `${paddedCount}%` : paddedCount;
  };

  return (
    <div className={className}>
      {formatCount()}
    </div>
  );
};

export default Counter;