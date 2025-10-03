import { TAssessmentComponentSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';

export type WizardType = 'SINGLE' | 'GROUPED';
export type WizardStep = 'DETAILS' | 'PARTICIPANTS_AND_SETTINGS' | 'REVIEW';
export type ComponentSelection = {
  index: number | undefined;
  selection: TAssessmentComponentSchema | undefined;
};