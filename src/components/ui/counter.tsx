"use client";

import {
  KeyframeOptions,
  animate,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import { useRef } from "react";

type AnimatedCounterProps = {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions;
};

const AnimatedCounter = ({
  from,
  to,
  animationOptions,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Set initial value
    element.textContent = String(from);

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 3,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value === 100 ? "100%" : value.toFixed(1) + "%";
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, from, to]);

  return <span ref={ref} />;
};

export default AnimatedCounter;
