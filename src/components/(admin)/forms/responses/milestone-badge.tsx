import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Milestone } from "@/db/schema";
import { cn } from "@/lib/utils";
// A milestone badge should display the concatenated name of a milestone, on hover it gives more details about case-level performance
export function MilestoneBadge({ milestone }: { milestone: Milestone }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={cn("pt-1 text-xs font-normal")} variant={"foreground"}>
            {milestone.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{milestone.description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
