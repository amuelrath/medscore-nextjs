"use client";
import Lottie from "lottie-react";
import { cn } from "@/lib/helpers/utils";
import { CSSProperties, useEffect, useRef } from "react";
interface LottiePlayerProps {
  icon: any;
  isPlaying: boolean;
  width?: string;
  height?: string;
  className?: string;
  style?: CSSProperties;
}
export function LottiePlayer({
  icon,
  isPlaying,
  width = "84px",
  height = "84px",
  className,
  style,
}: LottiePlayerProps) {
  const lottieRef = useRef<any>(null);
  useEffect(() => {
    if (isPlaying) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isPlaying]);
  return (
    <div className={cn("rounded-md border", className)} style={style}>
      <Lottie
        loop
        lottieRef={lottieRef}
        animationData={icon}
        style={{ width, height }}
      />
    </div>
  );
}
