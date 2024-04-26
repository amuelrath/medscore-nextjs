import { Program } from "@/db/schema";
import { createContext, useContext } from "react";

export const ProgramContext = createContext<Program[] | undefined>(undefined);

export const useCurrentPrograms = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useCurrentPrograms must be used within a ProgramProvider");
  }
};

export default function ProgramProvider({
  children,
  program,
}: {
  children: React.ReactNode;
  program: Program[];
}) {
  return (
    <ProgramContext.Provider value={program}>
      {children}
    </ProgramContext.Provider>
  );
}
