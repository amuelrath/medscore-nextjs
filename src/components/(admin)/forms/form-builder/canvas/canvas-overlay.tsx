import { NEW_FORM_ITEMS } from '@/components/(admin)/forms/form-builder/constants';
import { FormItem } from '@/components/(admin)/forms/form-builder/form-items';
import { NewFormItem } from '@/components/(admin)/forms/form-builder/sidebar';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';

interface FormBuilderOverlayProps {
  state: DragOverlayState;
}

export function FormBuilderOverlay({ state }: FormBuilderOverlayProps) {
  const { isNewFormItem, isExistingFormItem, activeItem, activeIndex, active } =
    state;

  if (!active) return null;

  if (isExistingFormItem && activeItem) {
    return (
      <FormItem
        id={activeItem.id}
        type={activeItem.type}
        index={activeIndex}
        isClone
      />
    );
  }

  if (isNewFormItem) {
    const newItemConfig = NEW_FORM_ITEMS.find(
      (item) => item.itemType === active.data.current?.itemType,
    );

    if (!newItemConfig) return null;

    return <NewFormItem {...newItemConfig} isClone />;
  }

  return null;
}
