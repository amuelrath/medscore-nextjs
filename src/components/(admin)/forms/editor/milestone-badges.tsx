"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MilestoneBadges({ questionIndex }: { questionIndex: number }) {
  const {
    milestones,
    handleMouseEnter,
    handleMouseLeave,
    hoveredTagId,
    removeMilestone,
  } = useQuestionMilestones(questionIndex);

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-row items-center space-x-1">
        {milestones?.map((ms) => (
          <TooltipProvider delayDuration={0} key={ms.id}>
            <Tooltip>
              <TooltipTrigger asChild className="select-none">
                <m.div
                  layout={"position"}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="select-none"
                >
                  <Badge
                    variant="accent"
                    className={cn(`group relative select-none font-medium`)}
                    size={"xs"}
                    onMouseEnter={() => handleMouseEnter(ms.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span
                      className={cn(
                        "origin-center transition-all duration-200 ease-in-out",
                        hoveredTagId === ms.id
                          ? "scale-x-0 opacity-0"
                          : "scale-x-100 opacity-100",
                      )}
                    >
                      {ms.name}
                    </span>
                    <TrashIcon
                      size={12}
                      onClick={() => removeMilestone(ms.id)}
                      className={cn(
                        `absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-200`,
                        hoveredTagId === ms.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Badge>
                </m.div>
              </TooltipTrigger>
              <TooltipContent className="flex w-80 flex-col space-y-1 text-wrap bg-zinc-50">
                <p className="font-semibold">{ms.name}</p>
                <p>{ms.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </LazyMotion>
  );
}

// extracted logic for readability
function useQuestionMilestones(questionIndex: number) {
  const { control, getValues, setValue } = useFormContext<TFormSchema>();
  const milestoneIds = useWatch({
    control,
    name: `questions.${questionIndex}.milestoneIds`,
  });

  const { data: subcompetencies } = useSuspenseQuery({
    queryKey: ["subcompetencies", getValues(`id`)],
    queryFn: () => getSubcompetencies({ formId: getValues(`id`) }),
  });

  const milestones = subcompetencies
    .flatMap((sc) => sc.milestones)
    .filter((m) => milestoneIds?.includes(m.id));

  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);

  const removeMilestone = (milestoneId: string) => {
    const updatedMilestoneIds = milestoneIds.filter((id) => id !== milestoneId);
    setValue(`questions.${questionIndex}.milestoneIds`, updatedMilestoneIds);
  };

  const handleMouseEnter = (tagId: string) => {
    setHoveredTagId(tagId);
  };

  const handleMouseLeave = () => {
    setHoveredTagId(null);
  };

  return {
    milestones,
    handleMouseEnter,
    handleMouseLeave,
    hoveredTagId,
    removeMilestone,
  };
}
