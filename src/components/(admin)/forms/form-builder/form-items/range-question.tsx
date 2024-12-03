import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { isRange } from '@/components/(admin)/forms/form-builder/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ChangeEvent } from 'react';

interface RangeQuestionProps {
  id: string;
}

export function RangeQuestion({ id }: RangeQuestionProps) {
  const { updateItem } = useFormBuilderStore();
  const question = useFormBuilderStore((state) =>
    state.items.find((i) => i.id === id),
  );

  if (!question || !isRange(question)) {
    throw new Error('Question is not of correct type');
  }

  const handleQuestionTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateItem(id, (item) => ({
      ...item,
      text: e.target.value,
    }));
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value, 10);
    updateItem(id, (item) => ({
      ...item,
      minValue: min ? 0 : min,
    }));
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value, 10);
    updateItem(id, (item) => ({
      ...item,
      maxValue: max ? 100 : max,
    }));
  };

  return (
    <div className="space-y-6 pb-6">
      <AutosizeTextarea
        value={question.text}
        onChange={handleQuestionTextChange}
        placeholder="Question"
        className="text-sm font-medium"
        variant="typography"
      />
      <div className="flex flex-row space-x-4">
        <Input
          className="max-w-16 text-center text-sm"
          size="xs"
          placeholder="Min"
          value={question.minValue}
          onChange={handleMinChange}
          type="number"
        />
        <Slider disabled defaultValue={[0.5]} max={1} min={0} step={0.5} />
        <Input
          className="max-w-16 text-center text-sm"
          size="xs"
          placeholder="Max"
          value={question.maxValue}
          onChange={handleMaxChange}
          type="number"
        />
      </div>
    </div>
  );
}
