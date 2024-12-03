import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import {
  isMultipleChoice,
  TOptionSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { SquareIcon, XIcon } from 'lucide-react';
import React, { ChangeEvent, forwardRef } from 'react';
import { v4 } from 'uuid';

interface MultipleChoiceOptionProps {
  id: string;
  itemId: string;
}

function MultipleChoiceOption({ id, itemId }: MultipleChoiceOptionProps) {
  const { updateOption, removeOption } = useFormBuilderStore();
  const option = useFormBuilderStore((state) => {
    const question = state.items.find((i) => i.id === itemId);
    if (question && isMultipleChoice(question)) {
      return question.options.find((o) => o.id === id);
    }
    return null;
  });

  if (!option) return null;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateOption(itemId, id, e.target.value);
  };

  const handleRemoveOption = () => {
    removeOption(itemId, id);
  };

  return (
    <div className="flex flex-row bg-primary/[3%] rounded px-4 py-1 focus-within:bg-primary/5 transition-colors items-center space-x-2">
      <SquareIcon className="text-primary/40" size={16} />
      <Input
        value={option.text}
        onChange={handleTextChange}
        placeholder="Option"
        size="xs"
        variant="transparent"
        className="text-xs"
      />
      <XIcon
        role="button"
        className="text-primary/40 hover:text-destructive/70 transition-colors"
        size={18}
        onClick={handleRemoveOption}
      />
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
    className="flex flex-row bg-primary/[2%] rounded transition-colors p-2.5 hover:bg-primary/5 cursor-pointer items-center space-x-2"
  >
    <p className="opacity-50 text-xs">Add Option</p>
  </button>
));

AddOptionButton.displayName = 'AddOptionButton';

interface MultipleChoiceQuestionProps {
  id: string;
}

export function MultipleChoiceQuestion({ id }: MultipleChoiceQuestionProps) {
  const { updateItem, addOption } = useFormBuilderStore();
  const question = useFormBuilderStore((state) =>
    state.items.find((i) => i.id === id),
  );

  if (!question || !isMultipleChoice(question)) {
    throw new Error('Question is not of correct type');
  }

  const handleQuestionTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateItem(id, (item) => ({
      ...item,
      text: e.target.value,
    }));
  };

  const handleAddOption = () => {
    const newOption: TOptionSchema = {
      id: v4(),
      text: '',
      pointValue: 0,
      isNa: false
    };
    addOption(id, newOption);
  };

  return (
    <div className="space-y-2 pb-6">
      <AutosizeTextarea
        value={question.text}
        onChange={handleQuestionTextChange}
        placeholder="Question"
        className="text-sm font-medium"
        variant="typography"
      />
      <div className="flex flex-col space-y-2">
        {question.options.map((o) => (
          <MultipleChoiceOption key={o.id} id={o.id} itemId={id} />
        ))}
        <AddOptionButton onClick={handleAddOption} />
      </div>
    </div>
  );
}
