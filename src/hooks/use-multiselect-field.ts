import { useCallback, useEffect, useMemo } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";

type UseMultiselectField<TSchema extends FieldValues> = {
  control: Control<TSchema>;
  name: FieldPath<TSchema>;
  disabled?: boolean;
  defaultValue?: PathValue<TSchema, FieldPath<TSchema>>;
};

export function useMultiselectField<T extends FieldValues>({
  control,
  defaultValue,
  disabled,
  name,
}: UseMultiselectField<T>) {
  const { formState, fieldState, field } = useController<T>({
    control,
    name,
    disabled,
    defaultValue,
  });

  const selectedIds = useMemo(() => {
    const value = field.value as unknown;
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  }, [field.value]);

  const updateFieldValue = useCallback(
    (newValue: string[]) => {
      field.onChange(newValue as unknown as PathValue<T, typeof name>);
    },
    [field],
  );

  useEffect(() => {
    if (field.value === undefined) {
      updateFieldValue([]);
    }
  }, [field.value, updateFieldValue]);

  const select = useCallback(
    (userId: string) => {
      updateFieldValue([...selectedIds, userId]);
    },
    [selectedIds, updateFieldValue],
  );

  const deselect = useCallback(
    (userId: string) => {
      updateFieldValue(selectedIds.filter((id) => id !== userId));
    },
    [selectedIds, updateFieldValue],
  );

  return { select, deselect, selectedIds, field, fieldState, formState };
}
