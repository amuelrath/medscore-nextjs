import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { isChoiceItem, isRangeItem } from '@/components/(admin)/forms/form-builder/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/helpers/utils';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';

export interface MilestoneCardProps {
  milestone: SubcompetencyResult[number]['milestones'][number];
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { addMilestone, removeMilestone, selectedItemId, items } =
    useFormBuilderStore();

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const canAddMilestones =
    isRangeItem(selectedItem) || isChoiceItem(selectedItem);

  const hasMilestone =
    canAddMilestones && selectedItem?.milestoneIds?.includes(milestone.id);

  const handleClick = () => {
    if (!selectedItem) return;

    if (hasMilestone) {
      removeMilestone(selectedItem.id, milestone.id);
      return;
    }

    addMilestone(selectedItem.id, milestone.id);
  };

  return (
    <Card
      className={cn(
        'relative transition',
        hasMilestone && 'border-accent-secondary/60',
      )}
    >
      <CardHeader>
        <CardTitle className="text-md font-semibold">
          {milestone.name}
        </CardTitle>
        <CardDescription className="text-sm">
          {milestone.description}
        </CardDescription>
      </CardHeader>
      <button
        disabled={!selectedItem || !canAddMilestones}
        onClick={handleClick}
        type="button"
        className={cn(
          'absolute disabled:cursor-not-allowed shadow-sm flex group justify-center transition-colors flex-row' +
          'items-center -bottom-3 rounded-sm bg-white right-3 cursor-pointer w-12 h-6 border border-neutral-300',
          hasMilestone ? 'border-accent-secondary' : 'hover:border-neutral-500',
        )}
      >
        <motion.span
          className="flex flex-row items-center mt-[1px]"
          animate={{ rotate: hasMilestone ? 45 : 0 }}
        >
          <PlusIcon
            strokeWidth={1.5}
            className={cn(
              'size-5 group transition-colors',
              hasMilestone
                ? 'text-accent-secondary'
                : 'group-hover:text-neutral-500 text-neutral-400',
            )}
          />
        </motion.span>
      </button>
    </Card>
  );
}