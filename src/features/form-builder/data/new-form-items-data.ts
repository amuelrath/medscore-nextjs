import { NewFormItemProps } from '@/features/form-builder/types';
import { CheckCheckIcon, CircleDotIcon, HeadingIcon, Pilcrow, SlidersHorizontalIcon, TypeIcon } from 'lucide-react';

export const NEW_FORM_ITEMS: NewFormItemProps[] = [
  {
    itemType: 'WRITTEN',
    Icon: TypeIcon,
    label: 'Written',
  },
  {
    itemType: 'HEADER',
    Icon: HeadingIcon,
    label: 'Heading',
  },
  {
    itemType: 'PARAGRAPH',
    Icon: Pilcrow,
    label: 'Paragraph',
  },
  {
    itemType: 'SINGLE_CHOICE',
    Icon: CircleDotIcon,
    label: 'Select One',
  },
  {
    itemType: 'MULTIPLE_CHOICE',
    Icon: CheckCheckIcon,
    label: 'Select Multiple',
  },
  {
    itemType: 'RANGE',
    Icon: SlidersHorizontalIcon,
    label: 'Range',
  },
] as const;