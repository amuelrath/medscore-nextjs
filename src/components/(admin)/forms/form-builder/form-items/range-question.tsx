'use client'

import { useFormItemConfig } from '@/components/(admin)/forms/form-builder/hooks/use-form-item-config';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useCallback } from 'react';

interface UseRangeQuestionProps {
  id: string;
}

export function useRangeQuestion({ id }: UseRangeQuestionProps) {
  const { config, updateConfig } = useFormItemConfig({
    id,
    type: 'RANGE',
  });

  const handleTextChange = useCallback(
    (text: string) => {
      updateConfig('text', text);
    },
    [updateConfig],
  );

  const handleMinChange = useCallback(
    (value: string) => {
      const min = parseInt(value, 10);
      // Ensure we don't set invalid values
      if (!Number.isNaN(min) && min >= 0) {
        updateConfig('minValue', min);
      }
    },
    [updateConfig],
  );

  const handleMaxChange = useCallback(
    (value: string) => {
      const max = parseInt(value, 10);
      // Ensure we don't set invalid values and maintain max > min
      if (!Number.isNaN(max) && max <= 10) {
        updateConfig('maxValue', max);
      }
    },
    [updateConfig],
  );

  return {
    config,
    handleTextChange,
    handleMinChange,
    handleMaxChange,
  } as const;
}

interface RangeConfigProps {
  min: number;
  max: number;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function RangeConfig({ min, max, onMinChange, onMaxChange }: RangeConfigProps) {
  return (
    <div className="flex flex-row space-x-4">
      <Input
        className="max-w-16 text-center text-sm"
        size="xs"
        placeholder="Min"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        type="number"
        min={0}
        max={max}
      />
      <Slider
        defaultValue={[Math.floor((max + min) / 2)]}
        max={max}
        min={min}
        step={1}
      />
      <Input
        className="max-w-16 text-center text-sm"
        size="xs"
        placeholder="Max"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        type="number"
        min={min}
        max={10}
      />
    </div>
  );
}

interface RangeQuestionProps {
  id: string;
}

export function RangeQuestion({ id }: RangeQuestionProps) {
  const { config, handleTextChange, handleMinChange, handleMaxChange } =
    useRangeQuestion({ id });

  return (
    <div className="space-y-6 pb-6">
      <AutosizeTextarea
        value={config.text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Question"
        className="text-sm font-medium"
        variant="typography"
      />
      <RangeConfig
        min={config.minValue}
        max={config.maxValue}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    </div>
  );
}
