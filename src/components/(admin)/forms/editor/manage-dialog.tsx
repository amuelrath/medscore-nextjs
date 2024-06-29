"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LottieHover } from "@/components/ui/lottie-hover";
import CALENDAR from "public/icons/calendar-teal.json";
import { useState } from "react";

export function ManageDialog() {
  const [hovering, setHovering] = useState<boolean>(false);
  return (
    <Button variant="accent-secondary" className={cn("w-36")}>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={cn("flex flex-row items-center space-x-2")}
      >
        <LottieHover
          loop={false}
          isHovering={hovering}
          size="sm"
          src={CALENDAR}
        />
        <span className={cn("font-semibold text-teal-900")}>Manage</span>
      </div>
    </Button>
  );
}
