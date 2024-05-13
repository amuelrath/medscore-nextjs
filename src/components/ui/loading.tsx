"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { useRef } from "react";
import LOADING_ICON from "public/icons/system-regular-720-spinner-half-circles.json";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loadingStyles = cva("flex items-center justify-center", {
  variants: {
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      // Add more color variants as needed
    },
    size: {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-24 h-24",
      xl: "w-72 h-72",
      // Add more size variants as needed
    },
    icon: {
      default: LOADING_ICON,
      // Add more icon variants as needed
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
    icon: "default",
  },
});

interface LoadingProps extends VariantProps<typeof loadingStyles> {}

export default function Loading({ color, size, icon }: LoadingProps) {
  const ref = useRef<Player>(null);

  let iconSrc = LOADING_ICON;
  // Update the iconSrc based on the icon variant
  // Add more cases for additional icon variants
  switch (icon) {
    default:
      iconSrc = LOADING_ICON;
  }

  return (
    <div
      className={cn(
        loadingStyles({ color, size, icon }),
        "w-full h-full mt-[25%] flex flex-col justify-center items-center",
      )}
    >
      <Player
        ref={ref}
        src={iconSrc}
        loop
        autoplay
        style={{ width: "48px", height: "48px" }}
      />
    </div>
  );
}
