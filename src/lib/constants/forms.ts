import { TFormBuilderSettingsSchema } from '@/components/(admin)/forms/form-builder/types';
import { TFormType } from '@/db/schema';
import { ClipboardPenIcon, ClipboardPlusIcon, EyeIcon } from 'lucide-react';

export const DEFAULT_FORM_SETTINGS: Record<
  TFormType,
  TFormBuilderSettingsSchema
> = {
  OSCE: {
    editAccess: 'ME',
    allowResponseRevisions: false,
    passingCriteria: [],
    allowMultipleResponses: false,
    allowSaveAndQuit: false,
    enableScoring: false,
  },
  DIRECT_OBSERVATION: {
    editAccess: 'ME',
    allowResponseRevisions: false,
    passingCriteria: [],
    allowMultipleResponses: false,
    allowSaveAndQuit: false,
    enableScoring: false,
  },
  EVALUATION: {
    editAccess: 'ME',
    allowResponseRevisions: false,
    passingCriteria: [],
    allowMultipleResponses: false,
    allowSaveAndQuit: false,
    enableScoring: false,
  },
};
export const DEFAULT_FORM_NAME = {
  OSCE: 'Untitled OSCE',
  EVALUATION: 'Untitled Evaluation',
  DIRECT_OBSERVATION: 'Untitled Direct Observation',
};
export const formTypeContent = {
  OSCE: ClipboardPlusIcon,
  DIRECT_OBSERVATION: EyeIcon,
  EVALUATION: ClipboardPenIcon,
};
export const FORM_TYPE_COLORS = {
  OSCE: {
    text: 'text-accent-secondary/90',
    ring: 'ring-accent-secondary',
    bg: 'border-accent-secondary/40',
    border: 'bg-accent-secondary/20',
    color: 'hsl(var(--accent-secondary))',
  },
  EVALUATION: {
    text: 'text-accent/90',
    ring: 'ring-accent',
    bg: 'border-accent/40',
    border: 'bg-accent/20',
    color: 'hsl(var(--accent))',
  },
  DIRECT_OBSERVATION: {
    text: 'text-primary/90',
    ring: 'ring-primary',
    bg: 'border-primary/40',
    border: 'bg-primary/20',
    color: 'hsl(var(--primary))',
  },
};
