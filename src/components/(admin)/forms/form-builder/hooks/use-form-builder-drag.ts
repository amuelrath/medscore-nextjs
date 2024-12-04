'use client'

import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { TFormItemSchema } from '@/components/(admin)/forms/form-builder/types';
import {
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DRAG_AND_DROP } from '@/components/(admin)/forms/form-builder/constants';


export function useFormBuilderDrag() {
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
    if (active.data.current?.type === 'item') {
      setActiveItemId(active.id.toString());
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;

    if (!over) {
      setItemDropIndex(null);
      return;
    }

    // Only proceed if we're dragging a new item over an existing item
    const isNewItemDrag = active.id.toString().startsWith('new-item');
    const isDraggingOverItem = over.data.current?.type === 'item';

    if (!isNewItemDrag || !isDraggingOverItem) {
      return;
    }

    const activeY = active.rect.current.translated?.bottom;
    const overY = over.rect.bottom;
    const activeX = active.rect.current.translated?.left || 0;
    const overX = over.rect?.left || 0;
    const xDistance = Math.abs(activeX - overX);

    if (!activeY) {
      return;
    }

    if (xDistance >= DRAG_AND_DROP.DROP_ACTIVATION_DISTANCE) {
      setItemDropIndex(null);
      return;
    }

    const isAbove = activeY < overY;
    const overIndex = items.findIndex((i) => i.id === over.id);
    setItemDropIndex(isAbove ? overIndex : overIndex + 1);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isExistingItem = active.data.current?.type === 'item';
    const isDifferentItem = active.id !== over.id;

    if (isExistingItem && isDifferentItem) {
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

    if (!over) {
      setItemDropIndex(null);
      return;
    }

    const isNewItem = active.id.toString().startsWith('new-item');
    if (!isNewItem) {
      return;
    }

    const activeType = active.data.current?.itemType as TFormItemSchema['type'];

    // Handle empty form case
    if (items.length === 0) {
      addItem(activeType, 0);
      setItemDropIndex(null);
      return;
    }

    const activeX = active.rect.current.translated?.left || 0;
    const overX = over.rect?.left || 0;
    const xDistance = Math.abs(activeX - overX);

    if (xDistance < DRAG_AND_DROP.DROP_ACTIVATION_DISTANCE) {
      addItem(activeType, itemDropIndex || 0);
    }

    setItemDropIndex(null);
  };

  const handleDragCancel = () => {
    setActiveItemId(null);
    setItemDropIndex(null);
  };

  return {
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
