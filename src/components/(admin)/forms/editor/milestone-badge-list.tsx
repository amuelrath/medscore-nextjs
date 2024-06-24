import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TSubcompetencyRelate } from "@/db/types";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface MilestoneBadgesProps {
  milestoneIds: string[];
  subcompetencies: TSubcompetencyRelate[];
}

export const MilestoneBadgeList: FC<MilestoneBadgesProps> = ({
  milestoneIds,
  subcompetencies,
}) => {
  const milestones: TSubcompetencyRelate["milestones"] = subcompetencies
    .flatMap((sc) => sc.milestones)
    .filter((m): m is TSubcompetencyRelate["milestones"][0] => milestoneIds.includes(m.id));

  return (
    <>
      {milestones.map((m) => (
        <TooltipProvider key={`badge-${m.id}`}>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="foreground"
                className={cn("px-3 text-xs font-normal")}
              >
                {m.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{m.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
};

