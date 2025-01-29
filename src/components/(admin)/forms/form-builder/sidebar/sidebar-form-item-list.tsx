import { NEW_FORM_ITEMS } from '@/components/(admin)/forms/form-builder/constants';
import {
  NewFormItemProps,
  TFormItemSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { cn } from '@/lib/helpers/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
    <div className="col-span-3 space-y-2">
      <hr />
      <div className="grid grid-cols-3 gap-4 px-4">
      <p className="text-sm font-medium col-span-full">{label}</p>
        {NEW_FORM_ITEMS.filter((i) => itemTypes.includes(i.itemType)).map(
          (props) => (
            <NewFormItem key={props.itemType} {...props} />
          ),
        )}
      </div>
    </div>
  );
}

export function SidebarFormItemList() {
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
