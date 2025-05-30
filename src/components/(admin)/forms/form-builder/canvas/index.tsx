'use client';

import { CanvasContent } from '@/components/(admin)/forms/form-builder/canvas/canvas-content';
import { FormBuilderOverlay } from '@/components/(admin)/forms/form-builder/canvas/canvas-overlay';
import { LAYOUT } from '@/components/(admin)/forms/form-builder/constants';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import React, { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

export function FormBuilderCanvas() {
  const { setNodeRef, active } = useDroppable({ id: 'items' });

  // Get data directly from store instead of maintaining separate state
  const items = useFormBuilderStore((state) => state.items);
  const activeItemId = useFormBuilderStore((state) => state.activeItemId);
  const setSelectedItemId = useFormBuilderStore(
    (state) => state.setSelectedItemId,
  );

  // Memoize item IDs to avoid recalculating on every render
  const itemIds = useMemo(() => items.map((i) => i.id), [items]);

  // Memoize active item lookup to avoid repeated operations
  const activeItemData = useMemo(() => {
    if (!activeItemId) return { activeItem: undefined, activeIndex: -1 };

    const activeIndex = itemIds.findIndex((id) => id === activeItemId);
    const activeItem = activeIndex !== -1 ? itemIds[activeIndex] : undefined;

    return { activeItem, activeIndex };
  }, [activeItemId, itemIds]);

  // Memoize overlay state to prevent unnecessary child re-renders
  const overlayState: DragOverlayState = useMemo(
    () => ({
      isNewFormItem: Boolean(active?.id.toString().startsWith('new-item')),
      isExistingFormItem: Boolean(
        active?.data.current?.type === 'item' && activeItemData.activeItem,
      ),
      activeItem: activeItemData.activeItem,
      activeIndex: activeItemData.activeIndex,
      active,
    }),
    [active, activeItemData.activeItem, activeItemData.activeIndex],
  );

  // Memoize modifiers array to prevent recreation
  const dragModifiers = useMemo(
    () => (overlayState.isExistingFormItem ? [] : [snapCenterToCursor]),
    [overlayState.isExistingFormItem],
  );

  // Memoize click handler
  const handleDeselectItem = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if we clicked directly on the canvas background
      if (e.target === e.currentTarget) {
        setSelectedItemId(null);
      }
    },
    [setSelectedItemId],
  );

  // Memoize className to avoid recalculation
  const canvasClassName = useMemo(
    () =>
      cn(
        'scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-300',
        LAYOUT.CANVAS_CLASSES,
        LAYOUT.CANVAS_BACKGROUND_CLASSES,
        `min-h-[${LAYOUT.CANVAS_HEIGHT}]`,
        `max-h-[${LAYOUT.CANVAS_HEIGHT}]`,
      ),
    [],
  );

  // Memoize the drag overlay to prevent unnecessary re-renders
  const dragOverlay = useMemo(
    () => (
      <DragOverlay modifiers={dragModifiers}>
        <FormBuilderOverlay state={overlayState} />
      </DragOverlay>
    ),
    [dragModifiers, overlayState],
  );

  return (
    <div
      ref={setNodeRef}
      className={canvasClassName}
      onClick={handleDeselectItem}
    >
      <CanvasContent />
      {createPortal(dragOverlay, document.body)}
    </div>
  );
}
