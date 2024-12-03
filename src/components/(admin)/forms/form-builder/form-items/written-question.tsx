import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { isWritten } from '@/components/(admin)/forms/form-builder/types';
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from '@/components/ui/autosize-text-area';
import { ChangeEvent, useRef } from 'react';

interface WrittenQuestionProps {
  id: string;
}

export function WrittenQuestion({ id }: WrittenQuestionProps) {
  const ref = useRef<AutosizeTextAreaRef>(null);
  const { updateItem } = useFormBuilderStore();
  const question = useFormBuilderStore((state) =>
    state.items.find((i) => i.id === id),
  );

  if (!question || !isWritten(question)) {
    throw new Error('Question is not of correct type');
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateItem(id, (item) => ({
      ...item,
      text: e.target.value,
    }));
  };

  return (
    <div className="space-y-6 pb-6">
      <AutosizeTextarea
        placeholder="Question"
        ref={ref}
        className="text-sm font-medium"
        variant="typography"
        onChange={handleChange}
        value={question.text}
      />
      <div className="flex flex-col">
        <span className="border-b border-primary/60 border-dashed" />
        <span className="border-b border-primary/60 py-3 border-dashed" />
        <span className="border-b border-primary/60 py-3 border-dashed" />
      </div>
    </div>
  );
}
