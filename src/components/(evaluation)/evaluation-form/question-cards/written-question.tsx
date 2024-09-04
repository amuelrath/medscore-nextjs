import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomInput } from '@/types';
import { Controller, FieldValues } from 'react-hook-form';

interface WrittenQuestionProps<TSchema extends FieldValues>
  extends CustomInput<TSchema> {
  text: string | null;
}

export function WrittenQuestion<TSchema extends FieldValues>({
  control,
  name,
  defaultValue,
  disabled,
  text,
}: WrittenQuestionProps<TSchema>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <p>{text}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          control={control}
          name={name}
          disabled={disabled}
          defaultValue={defaultValue}
          render={({ field }) => (
            <AutosizeTextarea
              name={field.name}
              disabled={field.disabled}
              value={field.value}
              ref={field.ref}
              onChange={field.onChange}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
