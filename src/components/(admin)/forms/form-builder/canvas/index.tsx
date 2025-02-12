'use client';

import { CanvasContent } from '@/components/(admin)/forms/form-builder/canvas/canvas-content';
import { FormBuilderOverlay } from '@/components/(admin)/forms/form-builder/canvas/canvas-overlay';
import { LAYOUT } from '@/components/(admin)/forms/form-builder/constants';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import React from 'react';

export function FormBuilderCanvas() {
  const { items, activeItemId, setSelectedItemId } = useFormBuilderStore();
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

  const handleDeselectItem = (e: React.MouseEvent) => {
    // Only deselect if we clicked directly on the canvas background
    if (e.target === e.currentTarget) {
      setSelectedItemId(null);
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        LAYOUT.CANVAS_CLASSES,
        LAYOUT.CANVAS_BACKGROUND_CLASSES,
        `min-h-[${LAYOUT.CANVAS_HEIGHT}]`,
        `max-h-[${LAYOUT.CANVAS_HEIGHT}]`,
      )}
      onClick={handleDeselectItem}
    >
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
