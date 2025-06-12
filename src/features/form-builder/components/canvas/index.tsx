'use client';

import { CanvasContent } from '@/features/form-builder/components/canvas/canvas-content';
import { FormBuilderOverlay } from '@/features/form-builder/components/canvas/canvas-overlay';
import { useFormBuilderStore } from '@/features/form-builder/store';
import { DragOverlayState } from '@/features/form-builder/types';
import { cn } from '@/lib/utils';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import React, { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

// BEWARE of hacky styles
const LAYOUT_STYLES = {
  HEADER_HEIGHT: 40,
  TOOLBAR_HEIGHT: 70.73,
  CANVAS_HEIGHT: `calc(100vh-${40}px-${70.73}px)`,
  CANVAS_CLASSES:
    'md:col-span-6 col-span-5 overflow-y-scroll relative flex-grow p-4 pb-64 px-16',
  CANVAS_BACKGROUND_CLASSES:
    'bg-[radial-gradient(hsl(var(--primary)/0.2)_1px,transparent_1px)] [background-size:16px_16px]',
} as const;

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
  const canvasClassName = cn(
    'scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-300',
    LAYOUT_STYLES.CANVAS_CLASSES,
    LAYOUT_STYLES.CANVAS_BACKGROUND_CLASSES,
    `min-h-[${LAYOUT_STYLES.CANVAS_HEIGHT}]`,
    `max-h-[${LAYOUT_STYLES.CANVAS_HEIGHT}]`,
  );

  // Memoize the drag overlay to prevent unnecessary re-renders
  const dragOverlay = (
    <DragOverlay modifiers={dragModifiers}>
      <FormBuilderOverlay state={overlayState} />
    </DragOverlay>
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

FormBuilderCanvas.displayName = 'FormBuilderCanvas';
