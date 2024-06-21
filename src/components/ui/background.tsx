import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface BackgroundProps {
  color?: string;
  className?: string;
}

export function Background({ color = "hsl(170, 79%, 39%)", className }: BackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 bg-white",
        "[background:radial-gradient(125%_125%_at_60%_5%,#f4f4f5_65%,var(--bg-color)_100%)]",
        className
      )}
      style={{ "--bg-color": color } as CSSProperties}
    />
  );
}