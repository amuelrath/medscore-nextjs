'use client';

import { useFormBuilderStore } from '@/features/form-builder/store';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { NEW_FORM_ITEMS } from '@/features/form-builder/data/new-form-items-data';
import { SidebarQuestionDetails } from '@/features/form-builder/components/components-sidebar/sidebar-question-details';
import { SidebarFormItemList } from '@/features/form-builder/components/components-sidebar/sidebar-form-item-list';

export function FormBuilderSidebar() {
  const items = useFormBuilderStore((state) => state.items);
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId);
  const setSelectedItemId = useFormBuilderStore(
    (state) => state.setSelectedItemId,
  );

  const handleDeselectItem = () => {
    setSelectedItemId(null);
  };

  const selectedItemType = items.find((i) => i.id === selectedItemId)?.type;
  const SelectedItemIcon = NEW_FORM_ITEMS.find(
    (i) => i.itemType === selectedItemType,
  )?.Icon;

  return (
    <aside className="col-span-3 w-full bg-background flex-grow border-r">
      <header
        className={cn(
          'grid grid-cols-3 px-2 p-4',
          selectedItemType ? 'h-14' : 'h-[91.5px]',
        )}
      >
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
        <p className="col-start-2 col-span-1 text-lg text-center font-semibold self-start">
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
      <div className="space-y-4 select-none">
        {selectedItemId ? <SidebarQuestionDetails /> : <SidebarFormItemList />}
      </div>
    </aside>
  );
}
