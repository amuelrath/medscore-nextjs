import { TFormType } from '@/db/schema';
import {
  NewFormItemProps,
  TFormBuilderSettingsSchema,
} from '@/features/form-builder/types';
import {
  CheckCheckIcon,
  CircleDotIcon,
  HeadingIcon,
  Pilcrow,
  SlidersHorizontalIcon,
  TypeIcon,
} from 'lucide-react';

export const DEFAULT_FORM_SETTINGS: Record<
  TFormType,
  TFormBuilderSettingsSchema
> = {
  OSCE: {
    editAccess: 'ME',
    passingCriteria: [],
    enableScoring: false,
  },
  DIRECT_OBSERVATION: {
    editAccess: 'ME',
    passingCriteria: [],
    enableScoring: false,
  },
  EVALUATION: {
    editAccess: 'ME',
    passingCriteria: [],
    enableScoring: false,
  },
};
export const DEFAULT_FORM_NAME = {
  OSCE: 'Untitled OSCE',
  EVALUATION: 'Untitled Evaluation',
  DIRECT_OBSERVATION: 'Untitled Direct Observation',
};
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
