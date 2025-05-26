import { NewFormItemProps } from '@/components/(admin)/forms/form-builder/types';
import { MeasuringStrategy } from '@dnd-kit/core';
import {
  CheckCheckIcon,
  CircleDotIcon,
  HeadingIcon,
  Pilcrow,
  SlidersHorizontalIcon,
  TypeIcon,
} from 'lucide-react';

export const DRAG_AND_DROP = {
  DROP_ACTIVATION_DISTANCE: 300, // rough width of a <FormItem />
  MEASURING_STRATEGY: {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  },
} as const;

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

// BEWARE of hacky styles
export const LAYOUT = {
  HEADER_HEIGHT: 40,
  TOOLBAR_HEIGHT: 70.73,
  CANVAS_HEIGHT: `calc(100vh-${40}px-${70.73}px)`,
  CANVAS_CLASSES:
    'md:col-span-6 col-span-5 overflow-y-scroll relative flex-grow p-4 pb-64 px-16',
  CANVAS_BACKGROUND_CLASSES:
    'bg-[radial-gradient(hsl(var(--primary)/0.2)_1px,transparent_1px)] [background-size:16px_16px]',
} as const;
