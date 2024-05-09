"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
interface LottiePlayerProps {
  icon: any;
  isPlaying: boolean;
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}
export function LottiePlayer({
  icon,
  isPlaying,
  width = "84px",
  height = "84px",
  className,
  style,
}: LottiePlayerProps) {
  const lottieRef = useRef<Player>(null);
  useEffect(() => {
    if (isPlaying) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isPlaying]);
  return (
    <div className={cn("rounded-md border", className)} style={style}>
      <Player loop ref={lottieRef} src={icon} style={{ width, height }} />
    </div>
  );
}
