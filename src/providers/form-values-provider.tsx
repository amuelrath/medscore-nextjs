import { TFormRelate } from "@/db/types";
import { createContext, useContext } from "react";

export const FormValuesContext = createContext<{
  form: TFormRelate;
} | null>(null);

export const useFormValues = () => {
  const context = useContext(FormValuesContext);
  if (!context) {
    throw new Error("useFormValues must be used within a FormValuesProvider");
  }
  return context;
};
