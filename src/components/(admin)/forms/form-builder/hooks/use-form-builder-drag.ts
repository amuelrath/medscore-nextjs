'use client';

import { DRAG_AND_DROP } from '@/components/(admin)/forms/form-builder/constants';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { TFormItemSchema } from '@/components/(admin)/forms/form-builder/types';
import {
  Active,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  Over,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

// Utility functions moved outside component for better memory usage
const calculateCenterDistance = (active: Active, over: Over): number => {
  const activeRect = active.rect.current?.translated;
  const overRect = over.rect;

  if (!activeRect || !overRect) return Infinity;

  const activeCenter = activeRect.left + activeRect.width / 2;
  const overCenter = overRect.left + overRect.width / 2;

  return Math.abs(activeCenter - overCenter);
};

const isWithinDropDistance = (distance: number): boolean =>
  distance < DRAG_AND_DROP.DROP_ACTIVATION_DISTANCE;

const isNewItem = (id: string): boolean => id.startsWith('new-item');

export function hasOrderChanged(
  arr1: TFormItemSchema[],
  arr2: TFormItemSchema[],
): boolean {
  if (arr1.length !== arr2.length) return true;
  return arr1.some((item, index) => item.id !== arr2[index].id);
}

export function useFormBuilderDrag() {
  const [itemIds, setItemIds] = useState<string[]>(
    useFormBuilderStore.getState().items.map((i) => i.id),
  );

  useEffect(
    () =>
      useFormBuilderStore.subscribe(
        (state) => state.items,
        (items, prevItems) => {
          if (hasOrderChanged(items, prevItems)) {
            setItemIds([...items.map((i) => i.id)]);
          }
        },
      ),
    [],
  );

  // Capture actions from store
  const reorderItems = useFormBuilderStore((state) => state.reorderItems);
  const itemDropIndex = useFormBuilderStore((state) => state.itemDropIndex);
  const setItemDropIndex = useFormBuilderStore(
    (state) => state.setItemDropIndex,
  );
  const setActiveItemId = useFormBuilderStore((state) => state.setActiveItemId);
  const addItem = useFormBuilderStore((state) => state.addItem);

  // Memoize event handlers with useCallback
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      if (active.data.current?.type === 'item') {
        setActiveItemId(active.id.toString());
      }
    },
    [setActiveItemId],
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { over, active } = event;

      if (!over) {
        setItemDropIndex(null);
        return;
      }

      if (
        !isNewItem(active.id.toString()) ||
        over.data.current?.type !== 'item'
      ) {
        return;
      }

      const activeRect = active.rect.current?.translated;
      if (!activeRect) return;

      const xDistance = calculateCenterDistance(active, over);

      if (!isWithinDropDistance(xDistance)) {
        setItemDropIndex(null);
        return;
      }

      const isAbove = activeRect.bottom < over.rect.bottom;
      const overIndex = itemIds.findIndex((id) => id === over.id);
      const newDropIndex = isAbove ? overIndex : overIndex + 1;

      if (itemDropIndex !== newDropIndex) {
        setItemDropIndex(newDropIndex);
      }
    },
    [itemIds, itemDropIndex, setItemDropIndex],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const isExistingItem = active.data.current?.type === 'item';
      const isDifferentItem = active.id !== over.id;

      if (isExistingItem && isDifferentItem) {
        const oldIndex = itemIds.findIndex((id) => id === active.id);
        const newIndex = itemIds.findIndex((id) => id === over.id);

        // Only reorder if indices are valid
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(itemIds, oldIndex, newIndex);
          reorderItems(newOrder);
        }
      }
    },
    [itemIds, reorderItems],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.data.current?.type === 'item') {
        setActiveItemId(null);
      }

      if (!over) {
        setItemDropIndex(null);
        return;
      }

      if (!isNewItem(active.id.toString())) {
        return;
      }

      const activeType = active.data.current
        ?.itemType as TFormItemSchema['type'];

      if (itemIds.length === 0) {
        addItem(activeType, 0);
        setItemDropIndex(null);
        return;
      }

      const xDistance = calculateCenterDistance(active, over);
      if (isWithinDropDistance(xDistance)) {
        addItem(activeType, itemDropIndex ?? 0);
      }

      setItemDropIndex(null);
    },
    [itemIds, itemDropIndex, setActiveItemId, setItemDropIndex, addItem],
  );

  const handleDragCancel = useCallback(() => {
    setActiveItemId(null);
    setItemDropIndex(null);
  }, [setActiveItemId, setItemDropIndex]);

  return {
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
