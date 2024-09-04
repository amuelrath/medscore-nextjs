import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';

interface Option {
  id: string;
  text: string | null;
  position: number;
  isNa: boolean;
}

interface SingleChoiceQuestionProps<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
  TTypeName extends FieldPath<TSchema>,
  TAnswerIdName extends FieldPath<TSchema>,
> {
  control: Control<TSchema>;
  name: TName;
  options: Option[];
  text: string | null;
  disabled?: boolean;
  registerQuestionId: UseFormRegisterReturn<TName>;
  registerQuestionType: UseFormRegisterReturn<TTypeName>;
  registerAnswerId: UseFormRegisterReturn<TAnswerIdName>;
}

export function SingleChoiceQuestion<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
  TTypeName extends FieldPath<TSchema>,
  TAnswerIdName extends FieldPath<TSchema>,
>({
  control,
  name,
  options,
  text,
  disabled,
  registerQuestionId,
  registerQuestionType,
  registerAnswerId,
}: SingleChoiceQuestionProps<TSchema, TName, TTypeName, TAnswerIdName>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{text}</CardTitle>
      </CardHeader>
      <CardContent className="">
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
        <Controller<TSchema, TName>
          name={name}
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value} // Add this line
              value={field.value}
              disabled={disabled}
            >
              {options
                .sort((a, b) => a.position - b.position)
                .map((o) => (
                  <div key={o.id} className="flex mb-1 items-center space-x-4">
                    <RadioGroupItem className="" value={o.id} id={o.id}>
                      <Label htmlFor={o.id}>{o.text}</Label>
                    </RadioGroupItem>
                  </div>
                ))}
            </RadioGroup>
          )}
        />
      </CardContent>
    </Card>
  );
}
