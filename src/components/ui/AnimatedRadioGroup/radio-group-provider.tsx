import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

type TRadioGroupContext = {
  selectedValue: string | undefined;
  setSelectedValue: (newVal: string) => void;
  fieldName: string;
  registerOption: (value: string, optionRef: HTMLDivElement) => void;
  unregisterOption: (value: string) => void;
};

const RadioGroupContext = createContext<TRadioGroupContext | undefined>(
  undefined,
);

export function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("useRadioGroup must be used within a RadioGroupProvider");
  }
  return context;
}

interface RadioGroupProviderProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  legend?: string;
  fieldName: string;
}

const RadioGroupProvider = forwardRef<
  HTMLFieldSetElement,
  RadioGroupProviderProps
>(
  (
    {
      children,
      defaultValue,
      onChange,
      className,
      legend,
      fieldName,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(
      defaultValue || undefined,
    );
    const { setValue } = useFormContext();
    const optionRefs = useRef<Record<string, HTMLDivElement>>({});

    useEffect(() => {
      if (selectedValue) {
        setValue(fieldName, selectedValue);
        if (onChange) {
          onChange(selectedValue);
        }
      }
    }, [selectedValue, fieldName, onChange, setValue]);

    const registerOption = useCallback(
      (value: string, optionRef: HTMLDivElement) => {
        optionRefs.current[value] = optionRef;
      },
      [],
    );

    const unregisterOption = useCallback((value: string) => {
      delete optionRefs.current[value];
    }, []);

    return (
      <RadioGroupContext.Provider
        value={{
          selectedValue,
          setSelectedValue,
          fieldName,
          registerOption,
          unregisterOption,
        }}
      >
        <fieldset ref={ref} className={cn(className, "space-y-2")} {...props}>
          {legend && <legend>{legend}</legend>}
          {children}
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroupProvider.displayName = "RadioGroupProvider";
