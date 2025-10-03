import { DragOverlayState } from '@/features/form-builder/types';

import { NewFormItemOverlay } from '@/features/form-builder/components/components-sidebar/sidebar-form-item-list';
import { NEW_FORM_ITEMS } from '@/features/form-builder/data/default-settings-data';
import { FormItemWithSortable } from '../form-items';

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
