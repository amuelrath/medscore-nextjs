import { Badge } from "@/components/ui/badge";
const TooltipProvider = lazy(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipProvider,
  })),
);
const Tooltip = lazy(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.Tooltip,
  })),
);
const TooltipTrigger = lazy(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipTrigger,
  })),
);
const TooltipContent = lazy(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipContent,
  })),
);

import { Milestone } from "@/db/schema";
import { cn } from "@/lib/helpers/utils";
import { lazy, memo, Suspense } from "react";
// A milestone badge should display the concatenated name of a milestone, on hover it gives more details about case-level performance
export const MilestoneBadge = memo(
  ({ milestone }: { milestone: Partial<Milestone> }) => {
    const { name, description } = milestone;
    return (
      <Suspense
        fallback={
          <Badge
            className={cn(
              "mx-1 line-clamp-1 w-[72px] pt-1 text-center font-normal",
            )}
            variant="foreground"
          >
            {name}
          </Badge>
        }
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                className={cn("mx-1 line-clamp-1 w-[72px] font-normal")}
                variant={"foreground"}
              >
                {name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className={cn("fixed -top-3 right-16 z-50 w-64")}>
              {description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Suspense>
    );
  },
);

MilestoneBadge.displayName = "MilestoneBadge";
