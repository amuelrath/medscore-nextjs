'use client';

import { TFormSchema } from '@/components/(admin)/forms/editor/hooks/use-form-builder';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetSubcompetenciesInEditor } from '@/hooks/queries/use-get-form-subcompetencies';
import { cn } from '@/lib/helpers/utils';
import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';
import { m } from 'framer-motion';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// Individual MilestoneBadge component
export function MilestoneBadge({
  milestone,
  onRemove,
  showRemoveButton = false,
}: {
  milestone: SubcompetencyResult[0]['milestones'][0];
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild className="select-none">
          <m.div
            layout="position"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="select-none"
          >
            <Badge
              variant="accent-secondary"
              className={cn(
                `group relative select-none bg-accent-secondary-background text-xs font-medium`,
              )}
                onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span
                className={cn(
                  'origin-center transition-all duration-200 ease-in-out',
                  isHovered && showRemoveButton
                    ? 'scale-x-0 opacity-0'
                    : 'scale-x-100 opacity-100',
                )}
              >
                {milestone.name}
              </span>
              {showRemoveButton && (
                <TrashIcon
                  size={12}
                  onClick={() => onRemove?.(milestone.id)}
                  className={cn(
                    `absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-200`,
                    isHovered ? 'opacity-100' : 'opacity-0',
                  )}
                />
              )}
            </Badge>
          </m.div>
        </TooltipTrigger>
        <TooltipContent className="flex w-80 flex-col space-y-1 text-wrap bg-white text-xs">
          <p className="font-semibold">{milestone.name}</p>
          <p>{milestone.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// MilestoneBadges component (using the new MilestoneBadge)
export function MilestoneBadges({ questionIndex }: { questionIndex: number }) {
  const { milestones, removeMilestone } = useQuestionMilestones(questionIndex);

  return (
    <div className="flex flex-row items-center justify-end space-x-1">
      {milestones?.map((ms) => (
        <MilestoneBadge
          key={ms.id}
          milestone={ms}
          onRemove={removeMilestone}
          showRemoveButton
        />
      ))}
    </div>
  );
}

// Extracted logic for MilestoneBadges (mostly unchanged)
function useQuestionMilestones(questionIndex: number) {
  const { control, setValue } = useFormContext<TFormSchema>();
  const milestoneIds = useWatch({
    control,
    name: `formItems.${questionIndex}.milestoneIds`,
  });

  const { subcompetencies } = useGetSubcompetenciesInEditor();

  const milestones = subcompetencies
    .flatMap((sc) => sc.milestones)
    .filter((m) => milestoneIds?.includes(m.id));

  const removeMilestone = (milestoneId: string) => {
    const updatedMilestoneIds = milestoneIds.filter((id) => id !== milestoneId);
    setValue(`formItems.${questionIndex}.milestoneIds`, updatedMilestoneIds);
  };

  return {
    milestones,
    removeMilestone,
  };
}
