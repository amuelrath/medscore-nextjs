'use client';

import {
  TAssessmentComponentSchema,
  TAssessmentDetailsStepSchema,
  TAssessmentSchema,
} from '@/features/assessment-wizard/schemas/wizard-schemas';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialData: TAssessmentSchema = {
  details: {
    title: '',
    expiresAt: '',
    startsAt: '',
  },
  components: [],
};

type AssessmentWizardState = TAssessmentSchema & {
  setDetails: (details: TAssessmentDetailsStepSchema) => void;
  setComponents: (components: TAssessmentComponentSchema[]) => void;
  reset: () => void;
};

export const useAssessmentWizardStore = create<AssessmentWizardState>()(
  devtools(
    (set, get) => ({
      ...initialData,
      setDetails: (details) => set({ details }),
      setComponents: (components) => set({ components }),
      reset: () => {
        set({
          ...initialData,
        });
      },
    }),
    { name: 'AssessmentWizard Store', trace: true },
  ),
);

// =======================
