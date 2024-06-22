"use client";
import {
  FormVersionsResult,
  getAllVersions,
} from "@/server/actions/forms/get-all-versions";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

type TResponseContext = {
  versions: FormVersionsResult | undefined;
  selectedResponseId: string | undefined;
  setSelectedResponseId: (id: string | undefined) => void;
  selectedResponse: FormVersionsResult[0]["responses"][0] | undefined;
  selectedVersion: FormVersionsResult[0] | undefined;
  isLoading: boolean;
  error: Error | null;
};

const ResponseContext = createContext<TResponseContext | undefined>(undefined);

export const useResponseContext = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error(
      "useResponseContext must be used inside a ResponseContext.Provider!",
    );
  }
  return context;
};

export function ResponseProvider({
  formId,
  children,
}: {
  formId: string;
  children: ReactNode;
}) {
  const {
    data: versions,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ["all-versions", formId],
    queryFn: () => getAllVersions({ formId }),
  });

  const [selectedResponseId, setSelectedResponseId] = useState<
    string | undefined
  >(undefined);

  const { selectedResponse, selectedVersion } = useMemo(() => {
    if (!selectedResponseId || !versions)
      return { selectedResponse: undefined, selectedVersion: undefined };

    for (const version of versions) {
      const response = version.responses.find(
        (r) => r.id === selectedResponseId,
      );
      if (response) {
        return { selectedResponse: response, selectedVersion: version };
      }
    }

    return { selectedResponse: undefined, selectedVersion: undefined };
  }, [versions, selectedResponseId]);

  const contextValue = useMemo(
    () => ({
      versions,
      selectedResponseId,
      setSelectedResponseId,
      selectedResponse,
      selectedVersion,
      isLoading,
      error,
    }),
    [
      versions,
      selectedResponseId,
      selectedResponse,
      selectedVersion,
      isLoading,
      error,
    ],
  );

  return (
    <ResponseContext.Provider value={contextValue}>
      {children}
    </ResponseContext.Provider>
  );
}
