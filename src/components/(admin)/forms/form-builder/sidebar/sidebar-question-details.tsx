import { useFormBuilderMilestones } from '@/components/(admin)/forms/form-builder/milestone-sidebar';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { Switch } from '@/components/ui/switch';
import { AnimatePresence, motion } from 'framer-motion';
import { MilestoneCardProps } from '@/components/(admin)/forms/form-builder/milestone-sidebar/milestone-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/helpers/utils';
import { InfoIcon, XIcon } from 'lucide-react';

export function SmallMilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <Card className={cn('relative transition')}>
      <CardHeader className="flex flex-row items-center justify-between pr-3">
        <CardTitle className="text-md text-center font-semibold">
          {milestone.name}
        </CardTitle>
        <div className="absolute p-1 px-2 border bg-white -bottom-3 right-12 rounded-md">
          <InfoIcon className="opacity-50" size={16} />
        </div>
        <div className="absolute p-1 px-2 border bg-white -bottom-3 right-2 rounded-md">
          <XIcon className="opacity-50" size={16} />
        </div>
      </CardHeader>
    </Card>
  );
}

export function SidebarQuestionDetails() {
  const { items, selectedItemId, updateItem, removeMilestone } =
    useFormBuilderStore();

  const { data, isLoading, isError } = useFormBuilderMilestones();

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleUpdateRequired = (checked: boolean) => {
    if (!selectedItemId || !selectedItem || !('isRequired' in selectedItem))
      return;
    updateItem(selectedItemId, (i) => ({ ...i, isRequired: checked }));
  };

  const handleUpdateScored = (checked: boolean) => {
    if (!selectedItemId || !selectedItem) return;
    updateItem(selectedItemId, (i) => ({ ...i, isScored: checked }));
  };

  const handleRemoveMilestone = () => {};

  if (!selectedItem) return null;

  return (
    <div className="col-span-3 flex flex-col space-y-2 px-2">
      <hr />
      <p className="text-sm font-medium">Settings</p>
      {'isRequired' in selectedItem && (
        <div className="flex flex-row items-center space-x-4 text-sm">
          <Switch
            checked={selectedItem.isRequired}
            onCheckedChange={handleUpdateRequired}
            size="sm"
          />
          <p>Required</p>
        </div>
      )}
      {'isScored' in selectedItem && (
        <div className="flex flex-row items-center space-x-4 text-sm">
          <Switch
            checked={selectedItem.isScored}
            onCheckedChange={handleUpdateScored}
            size="sm"
          />
          <p>Scored</p>
        </div>
      )}
      {'milestoneIds' in selectedItem && (
        <>
          <hr />
          <p className="text-sm font-medium">Milestones</p>
          <ul className="flex-grow gap-4 grid grid-cols-2">
            <AnimatePresence>
              {selectedItem.milestoneIds?.map((m) => {
                const milestone = data
                  ?.flatMap((s) => s.milestones)
                  .find((i) => i.id === m);

                if (!milestone) return <div />;

                return (
                  <motion.div
                    className="col-span-1"
                    layout="position"
                    layoutId={m}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 100 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SmallMilestoneCard milestone={milestone} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ul>
        </>
      )}
    </div>
  );
}
