import { useFormBuilderMilestones } from '@/features/form-builder/hooks/use-form-builder-milestones';
import { useFormBuilderStore } from '@/features/form-builder/store';
import {
  isChoiceItem,
  isRangeItem,
} from '@/features/form-builder/types';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SubcompetencyResult } from '@/actions/forms/get-subcompetencies';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';

export interface MilestoneCardProps {
  milestone: SubcompetencyResult[number]['milestones'][number];
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { data: subcompetencies, isLoading } = useFormBuilderMilestones();

  const {
    addMilestone,
    removeMilestone,
    selectedItemId,
    items,
    settings,
    setSettings,
  } = useFormBuilderStore();

  if (!subcompetencies || isLoading) return '';

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const canAddMilestones =
    isRangeItem(selectedItem) || isChoiceItem(selectedItem);

  const hasMilestone =
    canAddMilestones && selectedItem?.milestoneIds?.includes(milestone.id);

  const handleClick = () => {
    if (!selectedItem) return;

    // Get the subcompetency for this milestone
    const thisSubcompetency = subcompetencies.find(
      (s) => s.id === milestone.subcompetencyId
    );

    if (!thisSubcompetency) return;

    // Check if the subcompetency is in passing criteria
    const subcompetencyInCriteria = settings.passingCriteria.find(
      (p) => p.subcompetencyId === thisSubcompetency.id
    );

    // REMOVAL LOGIC
    if (hasMilestone) {
      // Remove the milestone first
      removeMilestone(selectedItem.id, milestone.id);

      // Now check if ANY item still has this milestone's subcompetency
      const allMilestoneIds = items
        .filter((i) => (isRangeItem(i) || isChoiceItem(i)) && Array.isArray(i.milestoneIds))
      // @ts-ignore type error i dont want to fix right now
        .flatMap((i) => i.milestoneIds || []);

      // Get all milestones from this subcompetency
      const allSubcompetencyMilestoneIds = thisSubcompetency.milestones.map(m => m.id);

      // Check if ANY milestone from this subcompetency still exists in ANY item
      const hasRemainingMilestonesFromSubcompetency = allSubcompetencyMilestoneIds.some(
        id => id !== milestone.id && allMilestoneIds.includes(id)
      );

      // Only remove from passing criteria if NO milestones remain from this subcompetency
      if (!hasRemainingMilestonesFromSubcompetency && subcompetencyInCriteria) {
        setSettings({
          ...settings,
          passingCriteria: settings.passingCriteria.filter(
            (criteria) => criteria.subcompetencyId !== thisSubcompetency.id
          ),
        });
      }

      return;
    }

    // ADDITION LOGIC
    // Add the milestone
    addMilestone(selectedItem.id, milestone.id);

    // If this subcompetency is already in criteria, we're done
    if (subcompetencyInCriteria) return;

    // Create passing criteria just for this one subcompetency
    const uniqueLevels = Array.from(
      new Set(thisSubcompetency.milestones.map((m) => m.level))
    ).sort((a, b) => a - b);

    // Add ONLY this subcompetency to passing criteria
    setSettings({
      ...settings,
      passingCriteria: [
        ...settings.passingCriteria,
        {
          subcompetencyId: thisSubcompetency.id,
          threshold: 0.5, // Default value
          levelThresholds: uniqueLevels.map(level => ({
            level,
            threshold: 0.5 // Default value
          })),
        }
      ]
    });
  };

  return (
    <Card
      className={cn(
        'relative transition',
        hasMilestone && 'border-accent-secondary/60',
      )}
    >
      <CardHeader className="p-4">
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
