import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CustomInput } from '@/types';
import { useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';

interface Option {
  id: string;
  text: string | null;
  position: number;
  isNa: boolean;
}

interface MultipleChoiceQuestionProps<TSchema extends FieldValues>
  extends CustomInput<TSchema> {
  text: string | null;
  max?: number;
  options: Option[];
}

export function MultipleChoiceQuestion<TSchema extends FieldValues>({
  control,
  name,
  text,
  disabled,
  max,
  options,
  required = false,
}: MultipleChoiceQuestionProps<TSchema>) {
  const [previousSelections, setPreviousSelections] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{text}</CardTitle>
      </CardHeader>
      <CardContent>
        <Controller<TSchema>
          name={name}
          control={control}
          rules={{ required }}
          render={({ field }) => {
            const sortedOptions = [...options].sort(
              (a, b) => a.position - b.position,
            );
            const naOption = sortedOptions.find((o) => o.isNa);

            const handleChange = (checked: boolean, optionId: string) => {
              const currentValue: string[] = Array.isArray(field.value)
                ? field.value
                : [];
              let newValue: string[];

              if (optionId === naOption?.id) {
                if (checked) {
                  setPreviousSelections(currentValue);
                  newValue = [optionId];
                } else {
                  newValue = previousSelections;
                }
              } else {
                if (checked) {
                  newValue = [...currentValue, optionId];
                } else {
                  newValue = currentValue.filter((id) => id !== optionId);
                }

                if (max && newValue.length > max) {
                  newValue = newValue.slice(0, max);
                }
              }

              field.onChange(newValue);
            };

            const isNaSelected =
              naOption &&
              Array.isArray(field.value) &&
              field.value.includes(naOption.id);

            return (
              <ul className="space-y-2">
                {sortedOptions.map((o) => (
                  <li key={o.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={o.id}
                      checked={
                        Array.isArray(field.value) && field.value.includes(o.id)
                      }
                      onCheckedChange={(checked) =>
                        handleChange(checked === true, o.id)
                      }
                      disabled={
                        disabled || (isNaSelected && o.id !== naOption?.id)
                      }
                    />
                    <Label htmlFor={o.id}>{o.text}</Label>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
