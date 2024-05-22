"use client";
import Lottie from "lottie-react";
import EYEBALL_ICON from "public/icons/wired-flat-69-eye.json";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

export function Eyeball({ className }: { className?: string }) {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current?.setSpeed(0.7);
  }, []);

  return (
    <Lottie
      animationData={EYEBALL_ICON}
      loop
      lottieRef={ref}
      className={className}
    />
  );
}

export const DynamicEyeball = dynamic(() =>
  import("@/components/ui/lottie/eyeball").then((module) => module.Eyeball),
);
