'use client'

import { useFormBuilderStore } from '@/features/form-builder/store';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FormItem, FormItemWithSortable } from '../form-items';

export function CanvasContent() {
  // Get items directly from store instead of maintaining separate state
  const items = useFormBuilderStore(useShallow((state) => state.items));

  // Memoize IDs computation to avoid recalculating on every render
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  // Memoize the FormItem components to prevent unnecessary re-renders
  const formItems = useMemo(
    () =>
      itemIds.map((id, index) => (
        <FormItemWithSortable id={id} key={id} index={index} isClone={false} />
      )),
    [itemIds],
  );

  return (
    <SortableContext strategy={verticalListSortingStrategy} items={itemIds}>
      {formItems}
    </SortableContext>
  );
}


CanvasContent.displayName = 'CanvasContent'