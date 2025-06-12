"use client";
import { useRef, useState } from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ARROW from "public/icons/system-regular-161-trending-flat.json";
import { LottieHover } from "@/components/ui/lottie-hover";

export function SeeMoreButton({
  label,
  className,
  size,
}: {
  label: string;
  className?: string;
  size: "xs" | "default" | "lg" | "sm";
}) {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <Button
      className={cn(className)}
      size={size}
      variant="hide"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex flex-row items-center justify-center overflow-hidden",
        )}
      >
        <span
          className={cn(
            "transition-all duration-300",
            isHovered
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100",
          )}
        >
          {label}
        </span>
        <div
          className={cn(
            "left-3/5 absolute top-1/2 -translate-x-2/3 -translate-y-1/2 transform transition-transform duration-300",
            isHovered
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0",
          )}
        >
          <LottieHover
            isHovering={isHovered}
            src={ARROW}
          />
        </div>
      </div>
    </Button>
  );
}
