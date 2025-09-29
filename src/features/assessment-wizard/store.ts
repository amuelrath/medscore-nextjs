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
  // master-detail state
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;

  // assessment actions
  updateComponent: (
    id: string,
    data: Partial<TAssessmentComponentSchema>,
  ) => void;
  addComponent: (formId: string) => void;
  removeComponent: (id: string) => void;

  // general actions
  getFinalData: () => any; // returns final data structure
  reset: () => void;
};

export const useAssessmentWizardStore = create<AssessmentWizardState>()(
  devtools(
    (set, get) => ({
      ...initialData,

      // master detail actions
      selectedComponentId: '',
      setSelectedComponentId: (id: string) => set({ selectedComponentId: id }),

      // assessment actions
      updateComponent: (id, data) => {
        set((state) => {
          const updatedComponents = state.components.map((c) =>
            c.id === id ? { ...c, ...data } : c,
          );
          return { components: updatedComponents };
        });
      },
      addComponent: (formId) => {
        const newComponent = createComponent(formId);
        return set((state) => ({
          components: [...state.components, newComponent],
        }));
      },
      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        })),

      // general actions
      getFinalData: () => {
        // merge and zod parse each section's data
      },
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
