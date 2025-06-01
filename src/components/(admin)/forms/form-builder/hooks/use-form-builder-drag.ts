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
  KeyboardSensor,
  MouseSensor,
  Over,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useMemo, useRef } from 'react';

const ACTIVATION_DISTANCE = 0;

// Memoize these utility functions to avoid recreating them
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

export function useFormBuilderDrag() {
  // Use refs to avoid unnecessary re-renders
  const itemIdsRef = useRef<string[]>([]);
  const lastItemDropIndexRef = useRef<number | null>(null);

  // Get current items directly from store - avoid maintaining separate state
  const items = useFormBuilderStore((state) => state.items);
  const itemDropIndex = useFormBuilderStore((state) => state.itemDropIndex);

  // Capture actions from store
  const reorderItems = useFormBuilderStore((state) => state.reorderItems);
  const setItemDropIndex = useFormBuilderStore(
    (state) => state.setItemDropIndex,
  );
  const setActiveItemId = useFormBuilderStore((state) => state.setActiveItemId);
  const addItem = useFormBuilderStore((state) => state.addItem);

  // Memoize itemIds computation to avoid recalculating on every render
  const itemIds = useMemo(() => {
    const newItemIds = items.map((i) => i.id);
    itemIdsRef.current = newItemIds;
    return newItemIds;
  }, [items]);

  // Create a memoized lookup map for faster index finding
  const itemIdToIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    itemIds.forEach((id, index) => {
      map.set(id, index);
    });
    return map;
  }, [itemIds]);

  // Memoize event handlers with minimal dependencies
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
        if (lastItemDropIndexRef.current !== null) {
          setItemDropIndex(null);
          lastItemDropIndexRef.current = null;
        }
        return;
      }

      // Early exit for non-new items
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
        if (lastItemDropIndexRef.current !== null) {
          setItemDropIndex(null);
          lastItemDropIndexRef.current = null;
        }
        return;
      }

      const isAbove = activeRect.top <= over.rect.top;
      const overIndex = itemIdToIndexMap.get(over.id.toString()) ?? -1;

      if (overIndex === -1) return;

      const newDropIndex = isAbove ? overIndex : overIndex + 1;

      // Only update if the index actually changed
      if (lastItemDropIndexRef.current !== newDropIndex) {
        setItemDropIndex(newDropIndex);
        lastItemDropIndexRef.current = newDropIndex;
      }
    },
    [itemIdToIndexMap, setItemDropIndex],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const isExistingItem = active.data.current?.type === 'item';
      const isDifferentItem = active.id !== over.id;

      if (isExistingItem && isDifferentItem) {
        const oldIndex = itemIdToIndexMap.get(active.id.toString()) ?? -1;
        const newIndex = itemIdToIndexMap.get(over.id.toString()) ?? -1;

        // Only reorder if indices are valid and actually different
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newOrder = arrayMove(itemIdsRef.current, oldIndex, newIndex);
          reorderItems(newOrder);
        }
      }
    },
    [itemIdToIndexMap, reorderItems],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.data.current?.type === 'item') {
        setActiveItemId(null);
      }

      if (!over) {
        setItemDropIndex(null);
        lastItemDropIndexRef.current = null;
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
        lastItemDropIndexRef.current = null;
        return;
      }

      const xDistance = calculateCenterDistance(active, over);
      if (isWithinDropDistance(xDistance)) {
        addItem(activeType, itemDropIndex ?? itemIds.length); // add to end of the list as fallback
      }

      setItemDropIndex(null);
      lastItemDropIndexRef.current = null;
    },
    [itemIds.length, itemDropIndex, setActiveItemId, setItemDropIndex, addItem],
  );

  const handleDragCancel = useCallback(() => {
    setActiveItemId(null);
    setItemDropIndex(null);
    lastItemDropIndexRef.current = null;
  }, [setActiveItemId, setItemDropIndex]);

  // Configure sensors with minimum distance
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: ACTIVATION_DISTANCE, // Minimum pixels to move before drag starts
    },
    // Bypass the constraint for items that shouldn't have it
    bypassActivationConstraint: ({ activeNode }) => {
      // Get the draggable ID from the active node which will tell us what we are dragging
      const draggableId = activeNode?.id;

      // Bypass constraint for new form items
      return !draggableId.toString().startsWith('new-item-');
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: ACTIVATION_DISTANCE,
    },
    // Bypass the constraint for items that shouldn't have it
    bypassActivationConstraint: ({ activeNode }) => {
      // Get the draggable ID from the active node
      const draggableId = activeNode?.id;

      // Bypass constraint (return true) for all items EXCEPT the specific one
      return !draggableId.toString().startsWith('new-item-');
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return {
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    sensors,
  };
}
