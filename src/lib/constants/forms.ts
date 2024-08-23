import { TFormType } from '@/db/schema';
import { ZFormSettingsSchema } from '@/lib/zod/form-schema';
import { ClipboardPenIcon, ClipboardPlusIcon, EyeIcon } from 'lucide-react';
import { z } from 'zod';

type FormSettings = z.infer<typeof ZFormSettingsSchema>;

export const DEFAULT_FORM_SETTINGS: Record<TFormType, FormSettings> = {
  OSCE: {
    administerAccess: 'JUST_ME',
    editAccess: 'JUST_ME',
    allowResponseRevisions: false,
    allowResponseSaveAndQuit: true,
    allowMultipleSubmissions: false,
    scoresAffectGrades: true,
    roleWeights: [],
    passingCriteria: [],
  },
  DIRECT_OBSERVATION: {
    administerAccess: 'FACULTY_I_CHOOSE',
    editAccess: 'JUST_ME',
    allowResponseRevisions: false,
    allowResponseSaveAndQuit: false,
    allowMultipleSubmissions: true,
    scoresAffectGrades: true,
    roleWeights: [],
    passingCriteria: [],
  },
  EVALUATION: {
    administerAccess: 'JUST_ME',
    editAccess: 'JUST_ME',
    allowResponseRevisions: true,
    allowResponseSaveAndQuit: true,
    allowMultipleSubmissions: false,
    scoresAffectGrades: false,
    roleWeights: [],
    passingCriteria: [],
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
