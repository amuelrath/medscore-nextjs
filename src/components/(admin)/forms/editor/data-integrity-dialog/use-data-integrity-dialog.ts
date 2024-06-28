import { useState, useRef, useCallback, useEffect } from "react";
import {
  UseFormSetValue,
  Path,
  FieldValues,
  UseFormGetValues,
} from "react-hook-form";

interface PendingChange<T extends FieldValues> {
  name: Path<T>;
  newValue: any;
  originalValue: any;
}

interface UseDataIntegrityDialogProps<T extends FieldValues> {
  isAdministered: boolean;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  cooldownPeriod?: number; // in milliseconds
}

export const useDataIntegrityAlert = <T extends FieldValues>({
  isAdministered,
  setValue,
  getValues,
  cooldownPeriod = 30000, // default 30 seconds
}: UseDataIntegrityDialogProps<T>) => {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange<T> | null>(
    null,
  );
  const cooldownTimers = useRef<Record<string, number>>({});
  const originalValues = useRef<Record<string, any>>({});

  useEffect(() => {
    const currentValues = getValues();
    Object.keys(currentValues).forEach((key) => {
      originalValues.current[key] = currentValues[key as Path<T>];
    });
    console.log("Initial values:", originalValues.current);
  }, [getValues]);

  const handleValueChange = useCallback(
    (name: Path<T>, newValue: any) => {
      console.log(`handleValueChange called for ${name}`);
      console.log("Previous value:", originalValues.current[name]);
      console.log("New value:", newValue);

      if (isAdministered && !cooldownTimers.current[name]) {
        if (!(name in originalValues.current)) {
          originalValues.current[name] = getValues(name);
        }
        setShowWarning(true);
        setPendingChange({
          name,
          newValue,
          originalValue: originalValues.current[name],
        });
        console.log("Pending change set:", {
          name,
          newValue,
          originalValue: originalValues.current[name],
        });
        return false;
      } else {
        setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
        console.log("Value set without warning");
        return true;
      }
    },
    [isAdministered, setValue, getValues],
  );

  const handleConfirmEdit = useCallback(() => {
    if (pendingChange) {
      console.log("Confirming edit:", pendingChange);
      setValue(pendingChange.name, pendingChange.newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
      console.log("After setValue, new form values:", getValues());

      // Set cooldown timer
      cooldownTimers.current[pendingChange.name] = window.setTimeout(() => {
        delete cooldownTimers.current[pendingChange.name];
        console.log(`Cooldown ended for ${pendingChange.name}`);
      }, cooldownPeriod);
    }
    setShowWarning(false);
    setPendingChange(null);
  }, [pendingChange, setValue, getValues, cooldownPeriod]);

  const handleCancelEdit = useCallback(() => {
    if (pendingChange) {
      console.log("Cancelling edit:", pendingChange);
      setValue(pendingChange.name, pendingChange.originalValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setShowWarning(false);
    setPendingChange(null);
  }, [pendingChange, setValue]);

  const registerIntegrity = useCallback(
    (name: Path<T>) => ({
      onChange: (e: React.ChangeEvent<HTMLInputElement> | any[] | any) => {
        console.log(`onChange triggered for ${name}`);
        let newValue;
        if (Array.isArray(e)) {
          newValue = e;
        } else if (e && typeof e === "object" && "target" in e) {
          newValue = e.target.value;
        } else {
          newValue = e;
        }
        console.log("New value in onChange:", newValue);
        handleValueChange(name, newValue);
      },
      onBlur: () => {
        console.log(`onBlur triggered for ${name}`);
        if (!pendingChange) {
          originalValues.current[name] = getValues(name);
          console.log(
            "Original value updated on blur:",
            originalValues.current[name],
          );
        }
      },
    }),
    [handleValueChange, getValues, pendingChange],
  );

  return {
    showWarning,
    setShowWarning,
    pendingChange,
    handleConfirmEdit,
    handleCancelEdit,
    registerIntegrity,
  };
};
