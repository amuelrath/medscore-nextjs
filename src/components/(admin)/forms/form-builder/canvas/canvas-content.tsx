import { FormItem } from '@/components/(admin)/forms/form-builder/form-items';
import { hasOrderChanged } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-drag';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

export function CanvasContent() {
  const [ids, setIds] = useState<string[]>(
    useFormBuilderStore.getState().items.map((i) => i.id),
  );

  useEffect(
    () =>
      useFormBuilderStore.subscribe(
        (state) => state.items,
        (items, prevItems) => {
          if (hasOrderChanged(items, prevItems)) {
            setIds([...items.map((i) => i.id)]);
          }
        },
      ),
    [],
  );

  return (
    <SortableContext strategy={verticalListSortingStrategy} items={ids}>
      {ids.map((id, index) => (
        <FormItem id={id} key={id} index={index} isClone={false} />
      ))}
    </SortableContext>
  );
}
