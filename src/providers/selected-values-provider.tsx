import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormVersionResult, ResponseResult } from "@/db/types";

type SelectedContextType = {
  selectedVersion?: FormVersionResult;
  setSelectedVersion: (version?: FormVersionResult) => void;
  selectedResponse?: ResponseResult;
  setSelectedResponse: (response?: ResponseResult) => void;
};

const SelectedContext = createContext<SelectedContextType>({
  setSelectedVersion: () => {},
  setSelectedResponse: () => {},
});

export const useSelectedContext = () => useContext(SelectedContext);

export function SelectedProvider({ children }: { children: ReactNode }) {
  const [selectedVersion, setSelectedVersion] = useState<
    FormVersionResult | undefined
  >(undefined);
  const [selectedResponse, setSelectedResponse] = useState<
    ResponseResult | undefined
  >(undefined);

  useEffect(() => {
    setSelectedResponse(undefined);
  }, [setSelectedResponse, selectedVersion]);

  return (
    <SelectedContext.Provider
      value={{
        selectedVersion,
        setSelectedVersion,
        selectedResponse,
        setSelectedResponse,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
}
