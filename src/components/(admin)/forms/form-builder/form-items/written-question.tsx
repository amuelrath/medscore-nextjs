import { useFormItemConfig } from '@/components/(admin)/forms/form-builder/hooks/use-form-item-config';
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from '@/components/ui/autosize-text-area';
import React, { useCallback, useRef } from 'react';

interface UseWrittenQuestionProps {
  id: string;
}

export function useWrittenQuestion({ id }: UseWrittenQuestionProps) {
  const { config, updateConfig } = useFormItemConfig({
    id,
    type: 'WRITTEN',
  });

  const handleTextChange = useCallback(
    (text: string) => {
      updateConfig('text', text);
    },
    [updateConfig],
  );

  return {
    config,
    handleTextChange,
  } as const;
}

interface WrittenResponseAreaProps {
  lines?: number;
}

function WrittenResponseArea({ lines = 3 }: WrittenResponseAreaProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: lines }).map((_, index) => (
        <span
          className="border-b border-primary/60 border-dashed"
          style={{ paddingTop: index > 0 ? '1.25rem' : undefined }}
        />
      ))}
    </div>
  );
}

interface WrittenQuestionContentProps {
  value: string;
  onChange: (text: string) => void;
  textareaRef?: React.RefObject<AutosizeTextAreaRef>;
}

function WrittenQuestionContent({
  value,
  onChange,
  textareaRef,
}: WrittenQuestionContentProps) {
  return (
    <AutosizeTextarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Question"
      ref={textareaRef}
      className="text-sm font-medium"
      variant="typography"
    />
  );
}

export function WrittenQuestion({ id }: { id: string }) {
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const { config, handleTextChange } = useWrittenQuestion({ id });

  return (
    <div className="space-y-6 pb-6">
      <WrittenQuestionContent
        value={config.text}
        onChange={handleTextChange}
        textareaRef={textareaRef}
      />
      <WrittenResponseArea />
    </div>
  );
}
