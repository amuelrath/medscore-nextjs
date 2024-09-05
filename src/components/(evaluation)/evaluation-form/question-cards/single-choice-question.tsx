import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/helpers/utils';
import { CustomInput } from '@/types';
import { FieldValues, useController } from 'react-hook-form';

interface Option {
  id: string;
  text: string | null;
  position: number;
  isNa: boolean;
}

interface SingleChoiceQuestionProps<TSchema extends FieldValues>
  extends CustomInput<TSchema> {
  options: Option[];
  text: string | null;
}

export function SingleChoiceQuestion<TSchema extends FieldValues>({
  control,
  name,
  options,
  text,
  disabled,
  required = false,
}: SingleChoiceQuestionProps<TSchema>) {
  const { fieldState, field } = useController({
    name,
    control,
    rules: { required: required ? 'This field is required' : false },
  });

  return (
    <Card
      className={cn(
        fieldState.error && 'outline outline-2 outline-destructive',
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg flex flex-row items-start">
          <p className="basis-[98%]">{text}</p>
          <span className="basis-[2%] text-end">{required && '*'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
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
        {fieldState.error && (
          <p className="text-destructive text-sm mt-2">
            {fieldState.error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
