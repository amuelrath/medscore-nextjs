import { Base } from '@/components/(admin)/forms/form-builder/form-items/base';
import { TFormBuilderSchema } from '@/components/(admin)/forms/form-builder/form-items/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Control, Controller } from 'react-hook-form';

interface WrittenQuestionProps {
  id: string;
  index: number;
  required?: boolean;
  disabled?: boolean;
  control: Control<TFormBuilderSchema>;
  remove: () => void;
}

export function WrittenQuestion({
  index,
  required,
  id,
  control,
  disabled,
  remove
}: WrittenQuestionProps) {
  return (
    <Base
      key={id}
      required={required}
      onCopyClick={() => null}
      index={index}
      onDeleteClick={remove}
    >
      <div className="space-y-6 pb-6">
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
        <div className="flex flex-col">
          <span className="border-b border-primary/60 border-dashed" />
          <span className="border-b border-primary/60 py-3 border-dashed" />
          <span className="border-b border-primary/60 py-3 border-dashed" />
        </div>
      </div>
    </Base>
  );
}
