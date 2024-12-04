'use client';

import { NEW_FORM_ITEMS } from '@/components/(admin)/forms/form-builder/constants';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import {
  NewFormItemProps,
  TFormItemSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/helpers/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftIcon } from 'lucide-react';

export function NewFormItem({
  itemType,
  label,
  Icon,
  isClone = false,
}: NewFormItemProps) {
  const { setNodeRef, transform, isDragging, attributes, listeners } =
    useDraggable({
      id: `new-item-${itemType}`,
      data: {
        itemType,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: `border 200ms ease, border-color 200ms ease`,
    border: isClone ? '1.55px solid' : '1.5px solid',
    borderColor: isClone
      ? 'hsl(var(--foreground) / 0.3)'
      : 'hsl(var(--border))',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'border flex flex-col bg-white items-center justify-center rounded-md h-24',
        isDragging && !isClone && 'opacity-0',
        isClone ? 'z-40 drop-shadow-xl' : 'drop-shadow-none',
      )}
    >
      <Icon className="opacity-40 size-8 mb-2" />
      <span className="text-xs text-center">{label}</span>
    </div>
  );
}

function SidebarSection({
  itemTypes,
  label,
}: {
  itemTypes: TFormItemSchema['type'][];
  label: string;
}) {
  return (
    <div className="col-span-3 space-y-2 px-2">
      <hr />
      <p className="text-sm font-medium">{label}</p>
      <div className="grid grid-cols-3 gap-4">
        {NEW_FORM_ITEMS.filter((i) => itemTypes.includes(i.itemType)).map(
          (props) => (
            <NewFormItem key={props.itemType} {...props} />
          ),
        )}
      </div>
    </div>
  );
}

function SidebarQuestionDetails() {
  const { items, selectedItemId, updateItem } = useFormBuilderStore();
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

      <hr />
      <p className="text-sm font-medium">Milestones</p>
    </div>
  );
}

function SidebarComponents() {
  return (
    <>
      <SidebarSection label="Layout" itemTypes={['HEADER', 'PARAGRAPH']} />
      <SidebarSection
        label="Input"
        itemTypes={['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'WRITTEN']}
      />
    </>
  );
}

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
      <header className="space-y-1 grid grid-cols-3 px-2 items-center mb-2">
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
        {selectedItemId ? <SidebarQuestionDetails /> : <SidebarComponents />}
      </div>
    </aside>
  );
}
