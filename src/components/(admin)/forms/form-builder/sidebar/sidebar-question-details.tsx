import { MilestoneCard } from '@/components/(admin)/forms/form-builder/milestone-menu/milestone-card';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import {
  DirectionAwareContent,
  DirectionAwareTabs,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/helpers/utils';
import { useFormBuilderMilestones } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-milestones';
import { MilestoneContent } from '../milestone-menu';

function SettingScoredSwitch() {
  const { items, selectedItemId, updateItem, settings } = useFormBuilderStore();
  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleUpdateScored = (checked: boolean) => {
    if (!selectedItemId || !selectedItem || !('isScored' in selectedItem))
      return;
    updateItem(selectedItemId, (i) => ({ ...i, isScored: checked }));
  };

  if (!selectedItem) return null;
  if (!('isScored' in selectedItem)) return null;

  return (
    <div className="flex flex-row items-center space-x-4 text-sm">
      <Switch
        checked={selectedItem.isScored && settings.enableScoring}
        disabled={!settings.enableScoring}
        onCheckedChange={handleUpdateScored}
        size="sm"
      />
      <p className={cn(settings.enableScoring ? '' : 'opacity-50')} >Scored</p>
    </div>
  );
}

function SettingRequiredSwitch() {
  const { items, selectedItemId, updateItem } = useFormBuilderStore();
  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleUpdateRequired = (checked: boolean) => {
    if (!selectedItemId || !selectedItem || !('isRequired' in selectedItem))
      return;
    updateItem(selectedItemId, (i) => ({ ...i, isRequired: checked }));
  };

  if (!selectedItem) return null;
  if (!('isRequired' in selectedItem)) return null;

  return (
    <div className="flex flex-row items-center space-x-4 text-sm">
      <Switch
        checked={selectedItem.isRequired}
        onCheckedChange={handleUpdateRequired}
        size="sm"
      />
      <p>Required</p>
    </div>
  );
}

function SettingMilestones() {
  const { data, isLoading, isError } = useFormBuilderMilestones();
  const { items, selectedItemId } = useFormBuilderStore();
  const selectedItem = items.find((i) => i.id === selectedItemId);

  const getMilestone = (id: string) =>
    data?.flatMap((s) => s.milestones).find((m) => m.id === id);

  if (!selectedItem) return null;
  if (!('milestoneIds' in selectedItem)) return null;
  if (!selectedItem.milestoneIds) return null;

  if (isLoading) return 'loading'; // TODO add loading spinner or skeleton

  return (
    <div className="pl-4 space-y-4">
      <p className="text-sm font-medium">Applied Milestones</p>

      <div
        className={cn(
          'space-y-4 h-[52vh] pr-2 overflow-y-scroll',
          !(selectedItem.milestoneIds.length > 0) &&
            'flex flex-col items-center justify-center',
        )}
      >
        {selectedItem.milestoneIds.length > 0 ? (
          selectedItem.milestoneIds.map((m) => {
            const milestone = getMilestone(m);
            if (!milestone) return null;
            return <MilestoneCard milestone={milestone}  />;
          })
        ) : (
          <p className="text-md font-semibold text-center opacity-50">
            No Milestones Selected
          </p>
        )}
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 pl-4">
        <p className="text-sm font-medium mb-4">Settings</p>
        <SettingRequiredSwitch />
        <SettingScoredSwitch />
      </div>
      <hr />
      <SettingMilestones />
    </div>
  );
}

const tabs = [
  {
    id: 0,
    label: 'Details',
    content: <SettingsContent />,
  },
  {
    id: 1,
    label: 'Milestones',
    content: <MilestoneContent />,
  },
];

export function SidebarQuestionDetails() {
  return (
    <div className="col-span-3 flex flex-col space-y-2">
      <DirectionAwareTabsProvider bubbleId="question-details-sidebar" tabs={tabs}>
        <DirectionAwareTabs />
        <div className="">
          <DirectionAwareContent />
        </div>
      </DirectionAwareTabsProvider>
    </div>
  );
}
