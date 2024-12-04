'use client';

import { CanvasBackgroundPattern } from '@/components/(admin)/forms/form-builder/canvas/canvas-background-pattern';
import { CanvasContent } from '@/components/(admin)/forms/form-builder/canvas/canvas-content';
import { FormBuilderOverlay } from '@/components/(admin)/forms/form-builder/canvas/canvas-overlay';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

const LAYOUT = {
  HEADER_HEIGHT: 40,
  TOOLBAR_HEIGHT: 70.73,
  CANVAS_HEIGHT: `calc(100vh-${40}px-${70.73}px)`,
  CANVAS_CLASSES:
    'md:col-span-6 col-span-5 overflow-y-scroll relative flex-grow p-4 pb-64 px-16',
} as const;

export function FormBuilderCanvas() {
  const { items, activeItemId } = useFormBuilderStore();
  const { setNodeRef, active } = useDroppable({ id: 'items' });

  const activeItem = items.find((i) => i.id === activeItemId);
  const activeIndex = items.findIndex((i) => i.id === activeItemId);

  const overlayState: DragOverlayState = {
    isNewFormItem: Boolean(active?.id.toString().startsWith('new-item')),
    isExistingFormItem: Boolean(
      active?.data.current?.type === 'item' && activeItem,
    ),
    activeItem,
    activeIndex,
    active,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        LAYOUT.CANVAS_CLASSES,
        `min-h-[${LAYOUT.CANVAS_HEIGHT}]`,
        `max-h-[${LAYOUT.CANVAS_HEIGHT}]`,
      )}
    >
      <CanvasBackgroundPattern />
      <CanvasContent items={items} />
      {createPortal(
        <DragOverlay transition="transform 75ms ease">
          <FormBuilderOverlay state={overlayState} />
        </DragOverlay>,
        document.body,
      )}
    </div>
  );
}
