'use client';

import { FormItem } from '@/components/(admin)/forms/form-builder/form-items';
import {
  NewFormItem,
  newFormItems,
} from '@/components/(admin)/forms/form-builder/sidebar';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

// TODO move this
function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 bg-white bg-[radial-gradient(hsl(var(--primary)/0.2)_1px,transparent_1px)] [background-size:16px_16px]" />
  );
}

export function FormBuilderContent() {
  const { items, activeItemId } = useFormBuilderStore();
  const { setNodeRef, active } = useDroppable({ id: 'items' });

  const activeItem = items.find((i) => i.id === activeItemId);
  const activeIndex = items.findIndex((i) => i.id === activeItemId);

  const shouldDisplayNewFormItemOverlay = Boolean(
    active && active.id.toString().startsWith('new-item'),
  );
  const shouldDisplayFormItemOverlay = Boolean(
    active && active.data.current?.type === 'item' && activeItem,
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'md:col-span-6 overflow-y-scroll relative flex-grow min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)] col-span-5 p-4 px-16',
      )}
    >
      <BackgroundPattern />
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={items.map((item) => item.id)}
      >
        {items.map((item, index) => (
          <FormItem
            key={item.id}
            id={item.id}
            type={item.type}
            index={index}
            isClone={false}
          />
        ))}
      </SortableContext>
      {createPortal(
        <DragOverlay transition="transform 75ms ease">
          {shouldDisplayFormItemOverlay && (
            <FormItem
              id={activeItem!.id}
              type={activeItem!.type}
              index={activeIndex}
              isClone
            />
          )}
          {shouldDisplayNewFormItemOverlay && (
            <NewFormItem
              {...newFormItems.find(
                (item) => item.itemType === active!.data.current?.itemType,
              )!}
              isClone
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </div>
  );
}
