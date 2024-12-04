'use client';

import { useFormBuilderDrag } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-drag';
import { FormBuilderMilestoneMenu } from '@/components/(admin)/forms/form-builder/milestone-sidebar';
import { FormBuilderSidebar } from '@/components/(admin)/forms/form-builder/sidebar';
import { FormBuilderToolbar } from '@/components/(admin)/forms/form-builder/toolbar';
import { closestCorners, DndContext, MeasuringStrategy } from '@dnd-kit/core';

import dynamic from 'next/dynamic';
// requires document to be defined.
const FormBuilderCanvas = dynamic(
  () =>
    import('@/components/(admin)/forms/form-builder/canvas').then(
      (module) => module.FormBuilderCanvas,
    ),
  { ssr: false },
);

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export function FormBuilder() {
  const dragHandlers = useFormBuilderDrag();

  return (
    <DndContext
      onDragOver={dragHandlers.handleDragOver}
      onDragMove={dragHandlers.handleDragMove}
      onDragEnd={dragHandlers.handleDragEnd}
      onDragStart={dragHandlers.handleDragStart}
      onDragCancel={dragHandlers.handleDragCancel}
      measuring={measuringConfig}
      collisionDetection={closestCorners}
    >
      <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
        <FormBuilderToolbar />
        <div className="grid grid-cols-12 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
          <FormBuilderSidebar />
          <FormBuilderCanvas />
          <FormBuilderMilestoneMenu />
        </div>
      </section>
    </DndContext>
  );
}
