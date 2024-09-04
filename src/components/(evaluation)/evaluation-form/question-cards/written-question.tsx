import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomInput } from '@/types';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';

interface WrittenQuestionProps<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
  TTypeName extends FieldPath<TSchema>,
  TAnswerIdName extends FieldPath<TSchema>,
> extends CustomInput<TSchema> {
  text: string | null;
  registerQuestionId: UseFormRegisterReturn<TName>;
  registerQuestionType: UseFormRegisterReturn<TTypeName>;
  registerAnswerId: UseFormRegisterReturn<TAnswerIdName>;
}

export function WrittenQuestion<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
  TTypeName extends FieldPath<TSchema>,
  TAnswerIdName extends FieldPath<TSchema>,
>({
  control,
  name,
  defaultValue,
  disabled,
  text,
  registerQuestionId,
  registerQuestionType,
  registerAnswerId,
}: WrittenQuestionProps<TSchema, TName, TTypeName, TAnswerIdName>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <p>{text}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          hidden
          name={registerQuestionId.name}
          ref={registerQuestionId.ref}
          onChange={registerQuestionId.onChange}
        />
        <input
          type="text"
          hidden
          name={registerQuestionType.name}
          ref={registerQuestionType.ref}
          onChange={registerQuestionType.onChange}
        />
        <input
          type="text"
          hidden
          name={registerAnswerId.name}
          ref={registerAnswerId.ref}
          onChange={registerAnswerId.onChange}
        />
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
