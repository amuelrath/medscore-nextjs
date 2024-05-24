"use client";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

interface LottieIconButtonProps extends ButtonProps {
  icon: any;
  label?: string;
}

export function LottieIconButton({
  icon,
  label,
  className,
  style,
  ...buttonProps
}: LottieIconButtonProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const lottieRef = useRef<any>();

  useEffect(() => {
    if (isHovering) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isHovering]);

  return (
    <Button
      {...buttonProps}
      variant={"foreground"}
      className={cn("relative rounded-md border", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={style}
      size={"sm"}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={icon}
        style={{ width: "56px", height: "56px" }}
        className={cn("drop-shadow-lg")}
      />
      <p className={cn("transition-all")}>{label}</p>
    </Button>
  );
}

export const DynamicLottieIconButton = dynamic(() =>
  import("@/components/ui/lottie-icon-button").then(
    (module) => module.LottieIconButton,
  ),
);
