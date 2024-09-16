import { create } from 'zustand';

interface FormBuilderActions {
  addWritten: () => void;
  addSingleChoice: () => void;
  addMultipleChoice: () => void;
  addRange: () => void;
  addHeader: () => void;
}

type SetFunctions = (newFunctions: FormBuilderActions) => void;

interface FormBuilderState extends FormBuilderActions {
  setFunctions: SetFunctions;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  addWritten: () => {},
  addSingleChoice: () => {},
  addMultipleChoice: () => {},
  addRange: () => {},
  addHeader: () => {},
  setFunctions: (newFunctions) =>
    set((state) => ({ ...state, ...newFunctions })),
}));
