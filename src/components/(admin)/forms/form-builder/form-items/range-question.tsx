import { Base } from '@/components/(admin)/forms/form-builder/form-items/base';
import { TFormBuilderSchema } from '@/components/(admin)/forms/form-builder/form-items/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Control, Controller } from 'react-hook-form';

interface RangeQuestionProps {
  id: string;
  index: number;
  required?: boolean;
  disabled?: boolean;
  control: Control<TFormBuilderSchema>;
  remove: () => void;
}

export function RangeQuestion({
  id,
  index,
  required,
  disabled,
  control,
  remove,
}: RangeQuestionProps) {
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
        <div className="flex flex-row space-x-4">
          <Controller
            control={control}
            name={`formItems.${index}.minValue`}
            disabled={disabled}
            render={({ field }) => (
              <Input
                className="max-w-16 text-center text-sm"
                size="xs"
                placeholder="Min"
                name={field.name}
                disabled={field.disabled}
                value={field.value}
                ref={field.ref}
                onChange={field.onChange}
              />
            )}
          />
          <Slider defaultValue={[50]} disabled max={100} min={0} step={1} />
          <Controller
            control={control}
            name={`formItems.${index}.maxValue`}
            disabled={disabled}
            render={({ field }) => (
              <Input
                className="max-w-16 text-center text-sm"
                size="xs"
                placeholder="Min"
                name={field.name}
                disabled={field.disabled}
                value={field.value}
                ref={field.ref}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Base>
  );
}
