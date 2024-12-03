'use client';

import { FormBuilderMilestoneMenu } from '@/components/(admin)/forms/form-builder/milestone-sidebar';
import { FormBuilderSidebar } from '@/components/(admin)/forms/form-builder/sidebar';
import { FormBuilderToolbar } from '@/components/(admin)/forms/form-builder/toolbar';
import { TFormItemSchema } from '@/components/(admin)/forms/form-builder/types';
import {
  closestCorners,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import dynamic from 'next/dynamic';
import { useFormBuilderStore } from './store';

// requires document to be defined.
const FormBuilderContent = dynamic(
  () =>
    import('@/components/(admin)/forms/form-builder/form-builder-content').then(
      (module) => module.FormBuilderContent,
    ),
  { ssr: false },
);

const DROP_ACTIVATION_DISTANCE = 130;

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // we are dragging an item
    if (active.data.current?.type === 'item') {
      setActiveItemId(active.id.toString());
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;

    // if we aren't dragging over anything, we don't need a drop index
    if (!over) {
      setItemDropIndex(null);
      return;
    }

    // figure out where we are trying to add the new question
    const activeY = active.rect.current.translated?.bottom;
    const overY = over.rect.bottom;
    const activeX = active.rect.current.translated?.left || 0;
    const overX = over.rect?.left || 0;
    const xDistance = Math.abs(activeX - overX);

    const isAbove = activeY && activeY < overY;

    if (
      active.id.toString().startsWith('new-item') &&
      over.data.current?.type === 'item' &&
      activeY
    ) {
      // ...we are dragging a new item and want to add it
      const overIndex = items.findIndex((i) => i.id === over.id);

      if (xDistance >= DROP_ACTIVATION_DISTANCE) {
        setItemDropIndex(null);
        return;
      }

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

    if (active.id.toString().startsWith('new-item') && over) {
      const activeType = active.data.current
        ?.itemType as TFormItemSchema['type'];

      // if there are no items, add a new one
      if (items.length === 0) {
        addItem(activeType, 0);
      }

      const activeX = active.rect.current.translated?.left || 0;
      const overX = over.rect?.left || 0;
      const xDistance = Math.abs(activeX - overX);

      if (xDistance < DROP_ACTIVATION_DISTANCE) {
        addItem(activeType, itemDropIndex || 0);
        setItemDropIndex(null);
      } else {
        setItemDropIndex(null);
      }
    }
  };

  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveItemId(null);
    setItemDropIndex(null);
  };

  return (
    <DndContext
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      measuring={measuringConfig}
      collisionDetection={closestCorners}
    >
      <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
        <FormBuilderToolbar />
        <div className="grid grid-cols-12 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
          <FormBuilderSidebar />
          <FormBuilderContent />
          <FormBuilderMilestoneMenu />
        </div>
      </section>
    </DndContext>
  );
}
