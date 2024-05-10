import { createContext, ReactNode, useContext, useState } from "react";

interface SelectedResponseIdContextValue {
  selectedResponseId: string | null;
  setSelectedResponseId: (id: string | null) => void;
}

export const SelectedResponseIdContext = createContext<
  SelectedResponseIdContextValue | undefined
>(undefined);

export const useSelectedResponseId = (): SelectedResponseIdContextValue => {
  const context = useContext(SelectedResponseIdContext);
  if (!context) {
    throw new Error(
      "useResponseId must be used within a SelectedResponseIdProvider",
    );
  }

  return context;
};

export default function SelectedResponseIdProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    null,
  );

  return (
    <SelectedResponseIdContext.Provider
      value={{ selectedResponseId, setSelectedResponseId }}
    >
      {children}
    </SelectedResponseIdContext.Provider>
  );
}
