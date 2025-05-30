import {
  ConfigForType,
  FormItemType,
} from '@/components/(admin)/forms/form-builder/types';
import { useShallow } from 'zustand/react/shallow';
import { useFormBuilderStore } from '../store';

interface UseFormItemConfigProps<T extends FormItemType> {
  id: string;
  type: T;
}

export function useFormItemConfig<T extends FormItemType>({
  id,
  type,
}: UseFormItemConfigProps<T>) {
  const updateItem = useFormBuilderStore((state) => state.updateItem);
  const scoringEnabled = useFormBuilderStore(
    (state) => state.settings.enableScoring,
  );

  // Explicitly type the store item
  const item = useFormBuilderStore(
    useShallow((state) => state.items.find((i) => i.id === id)),
  ) as ConfigForType<T> | undefined;

  if (!item || item.type !== type) {
    throw new Error(`Invalid form item type for id: ${id}. Expected ${type}`);
  }

  const updateConfig = <K extends keyof ConfigForType<T>>(
    key: K,
    value: ConfigForType<T>[K],
  ) => {
    updateItem(id, (current) => ({
      ...current,
      [key]: value,
    }));
  };

  return {
    config: item,
    scoringEnabled,
    updateConfig,
  } as const;
}
