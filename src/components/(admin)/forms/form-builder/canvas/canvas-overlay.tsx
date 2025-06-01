import { NEW_FORM_ITEMS } from '@/components/(admin)/forms/form-builder/constants';
import { FormItemWithSortable } from '@/components/(admin)/forms/form-builder/form-items';
import { DragOverlayState } from '@/components/(admin)/forms/form-builder/types';

import { NewFormItemOverlay } from '@/components/(admin)/forms/form-builder/sidebar/sidebar-form-item-list';

interface FormBuilderOverlayProps {
  state: DragOverlayState;
}

export function FormBuilderOverlay({ state }: FormBuilderOverlayProps) {
  const { isNewFormItem, isExistingFormItem, activeItem, activeIndex, active } =
    state;

  if (!active) return null;

  if (isExistingFormItem && activeItem) {
    return <FormItemWithSortable id={activeItem} index={activeIndex} isClone />;
  }

  if (isNewFormItem) {
    const newItemConfig = NEW_FORM_ITEMS.find(
      (item) => item.itemType === active.data.current?.itemType,
    );

    if (!newItemConfig) return null;

    return <NewFormItemOverlay Icon={newItemConfig.Icon} />;
  }

  return null;
}

FormBuilderOverlay.displayName = 'FormBuilderOverlay';
