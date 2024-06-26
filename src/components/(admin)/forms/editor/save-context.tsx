'use client'
import React, { createContext, useContext } from 'react';

type FormContextType = {
  isSaving: boolean;
};

const SaveContext = createContext<FormContextType | undefined>(undefined);

export const useSaveContext = () => {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const SaveContextProvider: React.FC<FormContextType & { children: React.ReactNode }> = ({ children, isSaving }) => {
  return <SaveContext.Provider value={{ isSaving }}>{children}</SaveContext.Provider>;
};