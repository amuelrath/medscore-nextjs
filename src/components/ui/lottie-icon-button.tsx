"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

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
  const lottieRef = useRef<Player>(null);

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
      className={cn("rounded-md border", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={style}
      size={"lg"}
    >
      <Player
        ref={lottieRef}
        src={icon}
        style={{ width: "92px", height: "92px" }}
      />
      <p className={cn("transition-all")}>{label}</p>
    </Button>
  );
}
