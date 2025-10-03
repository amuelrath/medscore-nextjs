'use client';

import { useFormItemConfig } from '@/features/form-builder/hooks/use-form-item-config';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useCallback, useMemo } from 'react';

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

  const handleValueChange = useCallback(
    (key: 'minValue' | 'maxValue', value: string) => {
      if (!value) {
        updateConfig(key, 0);
        return;
      }

      const numValue = parseFloat(value);
      if (!Number.isNaN(numValue)) {
        const isMin = key === 'minValue';
        const limit = isMin ? config.maxValue : 10;

        if (
          isMin
            ? numValue >= 0 && numValue <= limit
            : numValue >= config.minValue && numValue <= limit
        ) {
          updateConfig(key, numValue);
        }
      }
    },
    [config.maxValue, config.minValue, updateConfig],
  );

  return {
    config,
    handleTextChange,
    handleValueChange,
  } as const;
}

interface RangeConfigProps {
  min: number;
  max: number;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function RangeConfig({ min, max, onMinChange, onMaxChange }: RangeConfigProps) {
  const minDisplayValue = useMemo(() => {
    if (min === undefined || min === null) return '';
    return Number.isInteger(min) ? min.toString() : min.toFixed(1);
  }, [min]);

  const maxDisplayValue = useMemo(() => {
    if (max === undefined || max === null) return '';
    return Number.isInteger(max) ? max.toString() : max.toFixed(1);
  }, [max]);

  return (
    <div className="flex flex-row items-center space-x-4">
      <div className="flex bg-primary/[3%] rounded py-1 px-1 focus-within:bg-primary/5 transition-colors">
        <Input
          type="number"
          value={minDisplayValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          size="xs"
          variant="transparent"
          className="text-sm text-center w-16"
          min={0}
          max={max}
          step="0.1"
        />
      </div>

      <Slider
        defaultValue={[Math.floor((max + min) / 2)]}
        max={max}
        min={min}
        step={0.1}
        className="flex-1"
      />

      <div className="flex bg-primary/[3%] rounded py-1 px-1 focus-within:bg-primary/5 transition-colors">
        <Input
          type="number"
          value={maxDisplayValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          size="xs"
          variant="transparent"
          className="text-sm text-center w-16"
          min={min}
          max={10}
          step="0.1"
        />
      </div>
    </div>
  );
}

interface RangeQuestionProps {
  id: string;
}

export function RangeQuestion({ id }: RangeQuestionProps) {
  const { config, handleTextChange, handleValueChange } = useRangeQuestion({
    id,
  });

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
        onMinChange={(value) => handleValueChange('minValue', value)}
        onMaxChange={(value) => handleValueChange('maxValue', value)}
      />
    </div>
  );
}
