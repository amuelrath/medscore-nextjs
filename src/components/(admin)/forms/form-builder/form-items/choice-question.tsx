import { useFormItemConfig } from '@/components/(admin)/forms/form-builder/hooks/use-form-item-config';
import { ChoiceConfig } from '@/components/(admin)/forms/form-builder/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/helpers/utils';
import { motion } from 'framer-motion';
import { CircleIcon, SquareIcon, XIcon } from 'lucide-react';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { v4 } from 'uuid';

interface UseChoiceQuestionProps {
  id: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
}

export function useChoiceQuestion({ id, type }: UseChoiceQuestionProps) {
  const { config, updateConfig, scoringEnabled } = useFormItemConfig({
    id,
    type,
  });

  const hasNAOption = useMemo(
    () => config.options.some((option) => option.isNa),
    [config.options],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      updateConfig('text', text);
    },
    [updateConfig],
  );

  const handleAddOption = useCallback(() => {
    const newOption = {
      id: v4(),
      text: '',
      pointValue: 0,
      isNa: false,
      position: config.options.length + 1,
    };
    updateConfig('options', [...config.options, newOption]);
  }, [config.options, updateConfig]);

  const handleAddNAOption = useCallback(() => {
    if (hasNAOption) return;

    const newOption = {
      id: v4(),
      text: 'N/A',
      pointValue: 0,
      isNa: true,
      position: config.options.length + 1,
    };
    updateConfig('options', [...config.options, newOption]);
  }, [config.options, hasNAOption, updateConfig]);

  const handleUpdateOption = useCallback(
    (optionId: string, updates: Partial<ChoiceConfig['options'][number]>) => {
      updateConfig(
        'options',
        config.options.map((option) =>
          option.id === optionId ? { ...option, ...updates } : option,
        ),
      );
    },
    [config.options, updateConfig],
  );

  const handleRemoveOption = useCallback(
    (optionId: string) => {
      updateConfig(
        'options',
        config.options.filter((option) => option.id !== optionId),
      );
    },
    [config.options, updateConfig],
  );

  return {
    config,
    scoringEnabled,
    hasNAOption,
    handleAddOption,
    handleTextChange,
    handleAddNAOption,
    handleUpdateOption,
    handleRemoveOption,
  } as const;
}

interface ChoiceOptionProps {
  option: ChoiceConfig['options'][number];
  onUpdate: (updates: Partial<ChoiceConfig['options'][number]>) => void;
  onRemove: () => void;
  isScored?: boolean;
  variant: 'single' | 'multiple';
  scoringEnabled: boolean;
}

export function ChoiceOption({
  option,
  onUpdate,
  onRemove,
  isScored = true,
  variant,
  scoringEnabled,
}: ChoiceOptionProps) {
  const Icon = variant === 'single' ? CircleIcon : SquareIcon;

  const pointDisplayValue = React.useMemo(() => {
    if (option.pointValue === undefined || option.pointValue === null)
      return '';
    return Number.isInteger(option.pointValue)
      ? option.pointValue.toString()
      : option.pointValue.toFixed(1);
  }, [option.pointValue]);

  const handlePointValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      onUpdate({ pointValue: 0 });
      return;
    }
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue)) {
      onUpdate({ pointValue: numValue });
    }
  };

  // Consolidate container width and visibility logic
  const containerWidths = {
    main: isScored && scoringEnabled ? '80%' : '100%',
    points: isScored && scoringEnabled ? '20%' : '0%',
  };

  // Common container styles
  const commonContainerStyles =
    'flex flex-row bg-primary/[3%] rounded py-1 transition-colors';

  return (
    <div className="flex flex-row items-center space-x-2">
      <motion.div
        animate={{ width: containerWidths.main }}
        initial={{ width: '100%' }}
        className={cn(
          commonContainerStyles,
          'px-4 focus-within:bg-primary/5 items-center space-x-2',
        )}
      >
        <Icon className="text-primary/40" size={16} />
        <Input
          value={option.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          disabled={option.isNa}
          placeholder="Option"
          size="xs"
          variant="transparent"
          className="text-sm w-full"
        />
        <Button variant="hide" size="xs">
          <XIcon
            className="text-primary/40 hover:text-destructive/70 transition-colors"
            size={18}
            onClick={onRemove}
          />
        </Button>
      </motion.div>
      {isScored && scoringEnabled && (
        <motion.div
          initial={{ scaleX: 0, width: '0%' }}
          animate={{
            scaleX: 1,
            width: containerWidths.points,
          }}
          className={cn(
            commonContainerStyles,
            'origin-right focus-within:bg-primary/5 px-1 overflow-hidden',
            option.isNa && 'opacity-0 disabled:cursor-default',
          )}
        >
          <Input
            type="number"
            value={pointDisplayValue}
            onChange={handlePointValueChange}
            disabled={option.isNa}
            placeholder="Pts"
            size="xs"
            variant="transparent"
            className="text-sm text-center w-full"
            step="0.1"
          />
        </motion.div>
      )}
    </div>
  );
}

const AddOptionButton = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>(({ onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex flex-row basis-4/5 bg-primary/[2%] rounded transition-colors p-2.5 hover:bg-primary/5 cursor-pointer items-center space-x-2"
  >
    <p className="opacity-50 text-xs">Add Option</p>
  </button>
));

AddOptionButton.displayName = 'AddOptionButton';

const AddNAOptionButton = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>(({ onClick, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex flex-row disabled:bg-primary/[1%] disabled:cursor-not-allowed justify-center basis-1/5 bg-primary/[2%] rounded transition-colors p-2.5 hover:bg-primary/5 cursor-pointer items-center space-x-2"
  >
    <p className="opacity-50 text-xs">Add N/A</p>
  </button>
));

AddNAOptionButton.displayName = 'AddNAOptionButton';

// Unified Choice Question Component
interface ChoiceQuestionProps {
  id: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
}

export function ChoiceQuestion({ id, type }: ChoiceQuestionProps) {
  const {
    config,
    scoringEnabled,
    hasNAOption,
    handleTextChange,
    handleAddOption,
    handleAddNAOption,
    handleUpdateOption,
    handleRemoveOption,
  } = useChoiceQuestion({ id, type });

  return (
    <div className="space-y-2 pb-6">
      <AutosizeTextarea
        value={config.text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Question"
        className="text-sm font-medium"
        variant="typography"
      />
      <div className="flex flex-col space-y-2">
        {config.options.map((option) => (
          <ChoiceOption
            key={option.id}
            option={option}
            onUpdate={(updates) => handleUpdateOption(option.id, updates)}
            scoringEnabled={scoringEnabled}
            onRemove={() => handleRemoveOption(option.id)}
            variant={type === 'SINGLE_CHOICE' ? 'single' : 'multiple'}
            isScored={config.isScored}
          />
        ))}
        <div className="flex flex-row items-center space-x-2">
          <AddOptionButton onClick={handleAddOption} />
          <AddNAOptionButton
            onClick={handleAddNAOption}
            disabled={hasNAOption}
          />
        </div>
      </div>
    </div>
  );
}

// For backwards compatibility/easier imports
export function SingleChoiceQuestion({ id }: { id: string }) {
  return <ChoiceQuestion id={id} type="SINGLE_CHOICE" />;
}

export function MultipleChoiceQuestion({ id }: { id: string }) {
  return <ChoiceQuestion id={id} type="MULTIPLE_CHOICE" />;
}

SingleChoiceQuestion.displayName = 'SingleChoiceQuestion';
MultipleChoiceQuestion.displayName = 'MultipleChoiceQuestion';
ChoiceOption.displayName = 'ChoiceOption';
