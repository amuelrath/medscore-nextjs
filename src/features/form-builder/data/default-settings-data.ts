import { TFormType } from '@/db/schema';
import { TFormBuilderSettingsSchema } from '@/features/form-builder/types';

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