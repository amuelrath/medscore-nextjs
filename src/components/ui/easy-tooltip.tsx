import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface CustomTooltipProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  position?: TooltipPosition;
  delay?: number
  asChild?: boolean
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  tooltipContent,
  position = "top",
  delay=300,
  asChild=true
}) => (
    <TooltipProvider>
      <Tooltip delayDuration={delay} >
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent  className="text-xs text-neutral-500 text-left ml-9 max-w-64" side={position}>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

export default CustomTooltip;
