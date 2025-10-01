'use client';

import {
  TAssessmentComponentSchema,
  TAssessmentSchema,
} from '@/features/assessment-wizard/schemas/wizard-schemas';
import { addHours, addMinutes, format } from 'date-fns';
import { v4 } from 'uuid';
import { ZodError } from 'zod';
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
  reset: () => void;
  errors: Record<string, string>;
  setErrors: (
    errors: ZodError<{ components: TAssessmentComponentSchema[] }> | undefined,
  ) => void;
};

export const useAssessmentWizardStore = create<AssessmentWizardState>()(
  devtools(
    (set, get) => ({
      ...initialData,
      // master detail actions
      selectedComponentId: '',
      errors: {},
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
        const { setSelectedComponentId } = get();
        const newComponent = createComponent(formId);
        set((state) => ({
          components: [...state.components, newComponent],
        }));
        return setSelectedComponentId(newComponent.id);
      },
      removeComponent: (id) => {
        const { setSelectedComponentId, components, selectedComponentId } =
          get();

        // Find the index of the component being removed
        const removedIndex = components.findIndex((c) => c.id === id);

        // Remove errors associated with this component


        // DELETED HERE
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        }));

        // Get the updated components list
        const updatedComponents = components.filter((c) => c.id !== id);

        // If there are no more components, clear selection
        if (updatedComponents.length === 0) {
          setSelectedComponentId('');
          return;
        }

        // Only update selection if the removed component was selected
        if (selectedComponentId !== id) return;

        // If removed component was at index 0, select the new first component
        if (removedIndex === 0) {
          setSelectedComponentId(updatedComponents[0].id);
        }
        // If removed component was at the end, select the new last component
        else if (removedIndex >= updatedComponents.length) {
          setSelectedComponentId(
            updatedComponents[updatedComponents.length - 1].id,
          );
        }
        // Otherwise, select the component that's now at the same index
        else {
          setSelectedComponentId(updatedComponents[removedIndex].id);
        }
      },
      setErrors: (error) => {
        if (!error) return set({ errors: {} });

        const errorMap = Object.fromEntries(
          error.issues.map((i) => [i.path.join('.'), i.message]),
        );

        return set({ errors: errorMap });
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
