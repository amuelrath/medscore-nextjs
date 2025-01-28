'use client';

import { NEW_FORM_ITEMS } from '@/components/(admin)/forms/form-builder/constants';
import { SidebarQuestionDetails } from '@/components/(admin)/forms/form-builder/sidebar/sidebar-question-details';
import { SidebarFormItemList } from '@/components/(admin)/forms/form-builder/sidebar/sidebar-form-item-list';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { cn } from '@/lib/helpers/utils';
import { ArrowLeftIcon } from 'lucide-react';

export function FormBuilderSidebar() {
  const { items, selectedItemId, setSelectedItemId } = useFormBuilderStore();

  const handleDeselectItem = () => {
    setSelectedItemId(null);
  };

  const selectedItemType = items.find((i) => i.id === selectedItemId)?.type;
  const SelectedItemIcon = NEW_FORM_ITEMS.find(
    (i) => i.itemType === selectedItemType,
  )?.Icon;

  return (
    <aside className="col-span-3 w-full bg-background flex-grow border-r p-2">
      <header className="grid grid-cols-3 px-2 items-center h-14 mb-2">
        <ArrowLeftIcon
          className={cn(
            'col-span-1 cursor-pointer',
            selectedItemType
              ? 'opacity-60 hover:opacity-100 transition'
              : 'opacity-0',
          )}
          size={20}
          onClick={handleDeselectItem}
        />
        <p className="col-start-2 col-span-1 text-md font-semibold">
          {selectedItemId
            ? `Question ${items.findIndex((i) => i.id === selectedItemId) + 1}`
            : 'Components'}
        </p>
        <span
          className={cn(
            'col-span-1 flex justify-end',
            selectedItemType ? 'opacity-60' : 'opacity-0',
          )}
        >
          {SelectedItemIcon && <SelectedItemIcon className="size-6" />}
        </span>
      </header>
      <div className="space-y-4">
        {selectedItemId ? <SidebarQuestionDetails /> : <SidebarFormItemList />}
      </div>
    </aside>
  );
}
export { SmallMilestoneCard } from '@/components/(admin)/forms/form-builder/sidebar/sidebar-question-details';