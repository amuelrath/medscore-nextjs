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

  // Initialize originalValues with current form values
  useEffect(() => {
    const currentValues = getValues();
    Object.keys(currentValues).forEach((key) => {
      originalValues.current[key] = currentValues[key as Path<T>];
    });
  }, [getValues]);

  const handleValueChange = useCallback(
    (name: Path<T>, newValue: any) => {
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
        return false;
      } else {
        setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
        return true;
      }
    },
    [isAdministered, setValue, getValues],
  );

  const handleConfirmEdit = useCallback(() => {
    if (pendingChange) {
      setValue(pendingChange.name, pendingChange.newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Set cooldown timer
      cooldownTimers.current[pendingChange.name] = window.setTimeout(() => {
        delete cooldownTimers.current[pendingChange.name];
      }, cooldownPeriod);
    }
    setShowWarning(false);
    setPendingChange(null);
  }, [pendingChange, setValue, cooldownPeriod]);

  const handleCancelEdit = useCallback(() => {
    if (pendingChange) {
      setValue(pendingChange.name, pendingChange.originalValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setShowWarning(false);
    setPendingChange(null);
  }, [pendingChange, setValue]);

  const getFieldProps = useCallback(
    (name: Path<T>) => ({
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        handleValueChange(name, newValue);
      },
      onBlur: () => {
        if (!pendingChange) {
          originalValues.current[name] = getValues(name);
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
    getFieldProps,
  };
};
