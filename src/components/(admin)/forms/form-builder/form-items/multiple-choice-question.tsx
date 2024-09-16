import { Base } from '@/components/(admin)/forms/form-builder/form-items/base';
import { TFormBuilderSchema } from '@/components/(admin)/forms/form-builder/form-items/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { CircleIcon, XIcon } from 'lucide-react';
import { forwardRef, HTMLProps } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { v4 } from 'uuid';
import { motion } from 'framer-motion'

interface MultipleChoiceOptionProps {
  control: Control<TFormBuilderSchema>;
  optionIndex: number;
  questionIndex: number;
  onRemove: () => void;
}

function MultipleChoiceOption({
  control,
  optionIndex,
  questionIndex,
  onRemove,
}: MultipleChoiceOptionProps) {
  return (
    <div className="flex flex-row bg-primary/[3%] rounded px-4 py-1 focus-within:bg-primary/5 transition-colors items-center space-x-2">
      <CircleIcon className="text-primary/40" size={16} />
      <Controller
        control={control}
        name={`formItems.${questionIndex}.options.${optionIndex}.text`}
        render={({ field }) => (
          <Input
            size="xs"
            variant="transparent"
            className="text-xs"
            name={field.name}
            disabled={field.disabled}
            value={field.value}
            ref={field.ref}
            onChange={field.onChange}
          />
        )}
      />
      <XIcon
        role="button"
        className="text-primary/40 hover:text-destructive/70 transition-colors"
        size={18}
        onClick={onRemove}
      />
    </div>
  );
}

const AddOptionButton = forwardRef<
  HTMLButtonElement,
  HTMLProps<HTMLButtonElement>
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

interface MultipleChoiceQuestionProps {
  id: string;
  index: number;
  required?: boolean;
  disabled?: boolean;
  control: Control<TFormBuilderSchema>;
  remove: () => void;
}

export function MultipleChoiceQuestion({
  id,
  index,
  required,
  control,
  disabled,
  remove,
}: MultipleChoiceQuestionProps) {
  const {
    append,
    fields,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `formItems.${index}.options`,
  });

  const handleAddOption = () => {
    append({
      id: v4(),
      text: '',
      pointValue: 0,
    });
  };

  return (
    <Base
      key={id}
      required={required}
      onCopyClick={() => null}
      index={index}
      onDeleteClick={remove}
    >
      <motion.div layout="position" className="space-y-2 pb-6">
        <Controller
          control={control}
          name={`formItems.${index}.text`}
          disabled={disabled}
          render={({ field }) => (
            <AutosizeTextarea
              className="text-sm font-medium"
              variant="typography"
              name={field.name}
              disabled={field.disabled}
              value={field.value}
              ref={field.ref}
              onChange={field.onChange}
            />
          )}
        />
        <div className="flex flex-col space-y-2">
          {fields.map((field, optionIndex) => (
            <MultipleChoiceOption
              key={field.id}
              optionIndex={optionIndex}
              questionIndex={index}
              control={control}
              onRemove={() => removeOption(optionIndex)}
            />
          ))}
          <AddOptionButton onClick={handleAddOption} />
        </div>
      </motion.div>
    </Base>
  );
}
