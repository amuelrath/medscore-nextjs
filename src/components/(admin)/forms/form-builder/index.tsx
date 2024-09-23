'use client';

import { FormItem } from '@/components/(admin)/forms/form-builder/form-items';
import { FormBuilderToolbar } from '@/components/(admin)/forms/form-builder/toolbar';
import { FormBuilderMilestoneMenu } from '@/components/(admin)/milestone-menu';
import { cn } from '@/lib/helpers/utils';

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { v4 } from 'uuid';
import { useFormBuilderStore } from './store';

function FormBuilderContent() {
  const { items, activeItemId } = useFormBuilderStore();
  const { setNodeRef, active } = useDroppable({ id: 'items' });

  const activeItem = items.find((i) => i.id === activeItemId);
  const activeIndex = items.findIndex((i) => i.id === activeItemId);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'md:col-span-3 flex flex-col flex-grow min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)] col-span-5 p-4',
      )}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={items.map((item) => item.id)}
      >
        {items.map((item, index) => (
          <FormItem key={item.id} item={item} index={index} isClone={false} />
        ))}
      </SortableContext>
      {active &&
        active.data.current?.type === 'item' &&
        createPortal(
          <DragOverlay>
            <FormItem
              key={active.id}
              isClone
              item={activeItem!}
              index={activeIndex!}
            />
          </DragOverlay>,
          document.body,
        )}
    </div>
  );
}

function NewFormItem() {
  const { setNodeRef, transform, isDragging, attributes, listeners } =
    useDraggable({
      id: 'new-item',
      data: {
        type: 'new-item',
        item: {
          id: v4(),
          type: 'WRITTEN',
          text: `New Item, ${v4()}`,
        },
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="col-span-2 border rounded-md"
    >
      Drag Me!
    </div>
  );
}

function FormBuilderSidebar() {
  return (
    <aside className="col-span-2 w-full flex-col border-r flex flex-grow">
      <h3 className="text-center">Components</h3>
      <NewFormItem />
    </aside>
  );
}

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export function FormBuilder() {
  const {
    items,
    setItems,
    setActiveItemId,
    addItem,
    itemDropIndex,
    setItemDropIndex,
  } = useFormBuilderStore();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      if (active.data.current?.type === 'item') {
        setActiveItemId(active.id.toString());
      }
    },
    [setActiveItemId],
  );

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;
    if (!over) return;
    // figure out where we are trying to add the new question
    const activeY = active.rect.current.translated?.bottom;
    const overY = over.rect.bottom;

    const isAbove = activeY && activeY < overY;

    if (
      active.data.current?.type === 'new-item' &&
      over.data.current?.type === 'item' &&
      activeY
    ) {
      // ...we are dragging a new item and want to add it
      const overIndex = items.findIndex((i) => i.id === over.id);

      if (!isAbove) {
        // we are trying to add below the active index
        setItemDropIndex(overIndex + 1);
      } else {
        setItemDropIndex(overIndex);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    // handle sorting
    if (active.data.current?.type === 'item' && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.data.current?.type === 'item') {
      setActiveItemId(null);
    }

    if (active.data.current?.type === 'new-item' && over) {
      addItem({ id: v4(), text: 'new item' }, itemDropIndex || 0);
      setItemDropIndex(null);
    }
  };

  return (
    <DndContext
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      measuring={measuringConfig}
      collisionDetection={closestCorners}
    >
      <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
        <FormBuilderToolbar />
        <div className="grid grid-cols-7 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
          <FormBuilderSidebar />
          <FormBuilderContent />
          <FormBuilderMilestoneMenu />
        </div>
      </section>
    </DndContext>
  );
}
