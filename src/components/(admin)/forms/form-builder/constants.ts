import { MeasuringStrategy } from '@dnd-kit/core';
import { CheckboxIcon, HeadingIcon, InputIcon, PilcrowIcon, RadiobuttonIcon, SliderIcon } from '@radix-ui/react-icons';
import { NewFormItemProps } from '@/components/(admin)/forms/form-builder/types';

export const DRAG_AND_DROP = {
  DROP_ACTIVATION_DISTANCE: 130,
  MEASURING_STRATEGY: {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  },
} as const;


export const NEW_FORM_ITEMS: NewFormItemProps[] = [
  {
    itemType: 'WRITTEN',
    Icon: InputIcon,
    label: 'Written',
  },
  {
    itemType: 'HEADER',
    Icon: HeadingIcon,
    label: 'Heading',
  },
  {
    itemType: 'PARAGRAPH',
    Icon: PilcrowIcon,
    label: 'Paragraph',
  },
  {
    itemType: 'SINGLE_CHOICE',
    Icon: RadiobuttonIcon,
    label: 'Select One',
  },
  {
    itemType: 'MULTIPLE_CHOICE',
    Icon: CheckboxIcon,
    label: 'Select Multiple',
  },
  {
    itemType: 'RANGE',
    Icon: SliderIcon,
    label: 'Range',
  },
];