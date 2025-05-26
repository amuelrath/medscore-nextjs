'use client';

import { CanvasContent } from '@/components/(admin)/forms/form-builder/canvas/canvas-content';
import { FormBuilderOverlay } from '@/components/(admin)/forms/form-builder/canvas/canvas-overlay';
import { LAYOUT } from '@/components/(admin)/forms/form-builder/constants';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

export function FormBuilderCanvas() {
  // for item order
  const [ids, setIds] = useState<string[]>(
    useFormBuilderStore.getState().items.map((i) => i.id),
  );

  useEffect(
    () =>
      useFormBuilderStore.subscribe(
        (state) => state.items,
        (items, prevItems) => {
          if (prevItems.length !== items.length) {
            setIds([...items.map((i) => i.id)]);
          }
        },
      ),
    [],
  );
  const { setNodeRef, active } = useDroppable({ id: 'items' });

  const activeItemId = useFormBuilderStore((state) => state.activeItemId);
  const setSelectedItemId = useFormBuilderStore(
    (state) => state.setSelectedItemId,
  );

  const activeItem = ids.find((i) => i === activeItemId);
  const activeIndex = ids.findIndex((i) => i === activeItemId);

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
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-300',
        LAYOUT.CANVAS_CLASSES,
        LAYOUT.CANVAS_BACKGROUND_CLASSES,
        `min-h-[${LAYOUT.CANVAS_HEIGHT}]`,
        `max-h-[${LAYOUT.CANVAS_HEIGHT}]`,
      )}
      onClick={handleDeselectItem}
    >
      <CanvasContent />
      {createPortal(
        <DragOverlay  modifiers={overlayState.isExistingFormItem ? [] : [snapCenterToCursor]} >
          <FormBuilderOverlay state={overlayState} />
        </DragOverlay>,
        document.body,
      )}
    </div>
  );
}
