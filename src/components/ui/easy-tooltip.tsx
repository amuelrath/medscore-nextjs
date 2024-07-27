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
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  tooltipContent,
  position = "top",
  delay=300
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay} >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent  className="text-xs text-left max-w-64" side={position}>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
