'use client';

import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface MultistepFormContextType {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  currentStepIndex: number;
  step: ReactElement | null;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const MultistepFormContext = createContext<MultistepFormContextType | null>(
  null,
);

interface MultistepFormProviderProps {
  steps: ReactElement[];
  children: ReactNode;
}

export function MultistepFormProvider({
  steps,
  children,
}: MultistepFormProviderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const next = () => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };

  const previous = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goTo = (i: number) => {
    setCurrentStepIndex(i);
  };

  const value = useMemo(
    () => ({
      next,
      previous,
      goTo,
      currentStepIndex,
      step: steps[currentStepIndex] || null,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === steps.length - 1,
    }),
    [currentStepIndex, next, steps],
  );

  return (
    <MultistepFormContext.Provider value={value}>
      {children}
    </MultistepFormContext.Provider>
  );
}

export function useMultistepFormContext() {
  const context = useContext(MultistepFormContext);

  if (!context) {
    throw new Error(
      'useMultistepForm must be used within a MultistepFormProvider',
    );
  }

  return context;
}
