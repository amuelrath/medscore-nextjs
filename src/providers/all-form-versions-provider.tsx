"use client";

import { FormVersionsResult } from "@/db/types";
import { createContext, ReactNode, useContext } from "react";
import { useAllFormVersionsSuspenseQueryResult } from "@/hooks/useAllFormVersionsSuspenseQueryResult";

export const AllFormVersionsContext = createContext<{
  versions: FormVersionsResult;
} | null>(null);

export const useAllFormVersions = () => {
  const context = useContext(AllFormVersionsContext);
  if (!context) {
    throw new Error(
      "useAllFormVersions must be used within a AllFormVersionsProvider",
    );
  }
  return context;
};

export function AllFormVersionsProvider({ children }: { children: ReactNode }) {
  const { versions } = useAllFormVersionsSuspenseQueryResult();

  return (
    <AllFormVersionsContext.Provider value={{ versions }}>
      {children}
    </AllFormVersionsContext.Provider>
  );
}
