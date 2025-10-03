'use client';

import {
  TAssessmentComponentSchema,
  TAssessmentSchema,
} from '@/features/assessment-wizard/schemas/wizard-schemas';
import { addHours, addMinutes, format } from 'date-fns';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

function createComponent(
  formId: string | undefined,
): TAssessmentComponentSchema {
  const now = Date.now();
  return {
    id: v4(),
    formId: formId || '',
    title: '',
    startsAt: format(addMinutes(now, -2), "yyyy-MM-dd'T'HH:mm"),
    expiresAt: format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm"),
    multipleResponses: false,
    revisions: false,
    saveAndQuit: false,
  };
}

const initialData: TAssessmentSchema = {
  title: '',
  components: [], // contains all assessments without participant data
  participants: {
    type: 'PAIR',
    requests: [],
  }, // has all participant data
};

type AssessmentWizardState = TAssessmentSchema & {
  setComponents: (components: TAssessmentComponentSchema[]) => void;
};

export const useAssessmentWizardStore = create<AssessmentWizardState>()(
  devtools(
    (set, get) => ({
      ...initialData,
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
