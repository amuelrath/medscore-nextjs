import { TFormItemSchema } from '@/components/(admin)/forms/form-builder/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormItem } from '@/components/(admin)/forms/form-builder/form-items';

interface CanvasContentProps {
  items: TFormItemSchema[];
}

export function CanvasContent({ items }: CanvasContentProps) {
  return (
    <SortableContext
      strategy={verticalListSortingStrategy}
      items={items.map(item => item.id)}
    >
      {items.map((item, index) => (
        <FormItem
          key={item.id}
          id={item.id}
          type={item.type}
          index={index}
          isClone={false}
        />
      ))}
    </SortableContext>
  );
}