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
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  tooltipContent,
  position = "top",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="text-xs text-left max-w-64" side={position}>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
