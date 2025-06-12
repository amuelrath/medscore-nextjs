"use client";
"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { m, useAnimation, AnimationControls } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EnhancedTooltipProps {
  children: ReactNode;
  heading?: string;
  description: string;
  delay?: number;
  contentClassName?: string;
}

function getRelativeCoordinates(
  event: MouseEvent,
  referenceElement: HTMLElement,
) {
  const position = {
    x: event.clientX,
    y: event.clientY,
  };
  const rect = referenceElement.getBoundingClientRect();
  return {
    x: position.x - rect.left,
    y: position.y - rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function EnhancedTooltip({
  children,
  heading,
  description,
  delay = 500,
  contentClassName,
}: EnhancedTooltipProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls: AnimationControls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isOpen && containerRef.current) {
        const { x, y } = getRelativeCoordinates(e, containerRef.current);
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && tooltipRef.current && containerRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();

      let x = mousePosition.x - width / 2;
      let y = mousePosition.y - height - 10; // Position above the cursor

      // Ensure the tooltip stays within the container bounds
      const containerRect = containerRef.current.getBoundingClientRect();
      x = Math.max(0, Math.min(x, containerRect.width - width));
      y = Math.max(0, Math.min(y, containerRect.height - height));

      controls.start({ x, y, opacity: 1, scale: 1 });
    }
  }, [isOpen, mousePosition, controls]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div ref={containerRef} className="relative">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent asChild>
          <m.div
            ref={tooltipRef}
            className={cn(
              " rounded-lg border border-border bg-white p-2 text-xs shadow-lg",
              "transform-origin-center pointer-events-none",
              contentClassName,
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={controls}
            transition={{ duration: 0.2, ease: "easeOut" }}
            exit={{ opacity: 0, scale: 0.9}}
          >
            <div className="flex flex-col space-y-1">
              {heading && <p className="font-semibold">{heading}</p>}
              <p>{description}</p>
            </div>
          </m.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
