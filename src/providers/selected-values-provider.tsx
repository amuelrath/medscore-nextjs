import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormVersionResult, ResponseResult } from "@/db/types";

type SelectedContextType = {
  selectedVersion?: FormVersionResult | undefined;
  setSelectedVersion: (version?: FormVersionResult | undefined) => void;
  selectedResponse?: ResponseResult | undefined;
  setSelectedResponse: (response?: ResponseResult | undefined) => void;
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
