import { createContext, ReactNode, useContext, useState } from "react";
import { TFormVersion } from "@/db/types";

interface SelectedFormVersionContextValue {
  formVersion: TFormVersion | null;
  setFormVersion: (newFormVersion: TFormVersion | null) => void;
}

export const SelectedFormVersionContext = createContext<
  SelectedFormVersionContextValue | undefined
>(undefined);

export const useSelectedFormVersion = (): SelectedFormVersionContextValue => {
  const context = useContext(SelectedFormVersionContext);
  if (!context) {
    throw new Error(
      "useSelectedFormVersion must be used within a SelectedFormVersionProvider",
    );
  }

  return context;
};

export default function SelectedFormVersionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [formVersion, setFormVersion] = useState<TFormVersion | null>(null);

  return (
    <SelectedFormVersionContext.Provider
      value={{ formVersion, setFormVersion }}
    >
      {children}
    </SelectedFormVersionContext.Provider>
  );
}
