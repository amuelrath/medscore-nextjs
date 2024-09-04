import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  id: string;
  text: string | null;
  position: number;
  isNa: boolean;
}

interface SingleChoiceQuestionProps<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
> {
  control: Control<TSchema>;
  name: TName;
  options: Option[];
  text: string | null;
  disabled?: boolean;
}

export function SingleChoiceQuestion<
  TSchema extends FieldValues,
  TName extends FieldPath<TSchema>,
>({
  control,
  name,
  options,
  text,
  disabled,
}: SingleChoiceQuestionProps<TSchema, TName>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{text}</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Controller<TSchema, TName>
          name={name}
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value || ''} // Add a fallback empty string
              disabled={disabled}
            >
              {options
                .sort((a, b) => a.position - b.position)
                .map((o) => (
                  <div key={o.id} className="flex mb-1 items-center space-x-4">
                    <RadioGroupItem
                      value={o.id}
                      id={o.id}
                      checked={field.value === o.id}
                    >
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
