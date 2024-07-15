import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export function SimpleTooltip({
  children,
  heading,
  description,
  delay = 500,
}: {
  children: ReactNode;
  heading?: string;
  description: string;
  delay?: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-slate-50 text-xs">
          <div className="flex flex-col space-y-1 ">
            {heading && (
            <p className="font-semibold">{heading}</p>
            )}
            <p className="">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
