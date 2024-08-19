import { useCallback, useEffect, useMemo } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";

export type UseMultiselectField<TSchema extends FieldValues> = {
  control: Control<TSchema>;
  name: FieldPath<TSchema>;
  disabled?: boolean;
  defaultValue?: PathValue<TSchema, FieldPath<TSchema>>;
  max?: number
};

export function useMultiselectField<T extends FieldValues>({
  control,
  defaultValue,
  disabled,
  name,
  max=Infinity
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
    (itemId: string) => {
      if (selectedIds.length < max ) {
      updateFieldValue([...selectedIds, itemId]);
      }
    },
    [max, selectedIds, updateFieldValue],
  );

  const deselect = useCallback(
    (itemId: string) => {
      updateFieldValue(selectedIds.filter((id) => id !== itemId));
    },
    [selectedIds, updateFieldValue],
  );

  return { select, deselect, selectedIds, field, fieldState, formState };
}
