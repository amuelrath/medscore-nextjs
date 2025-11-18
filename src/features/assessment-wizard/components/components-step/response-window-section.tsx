import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TAssessmentComponentsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { CalendarIcon } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

interface ComponentResponseWindowSectionProps {
  selectedIndex: number | undefined;
}

export function ComponentResponseWindowSection({
  selectedIndex,
}: ComponentResponseWindowSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TAssessmentComponentsStepSchema>();

  const component = useWatch({
    control,
    name: `components.${selectedIndex as number}`,
  });

  if (!component) return null;

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={CalendarIcon} />
          <FormSectionHeaderTitle>Response Window</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div className="grid grid-cols-7 gap-4">
        <Label
          className="self-center"
          htmlFor={`components.${selectedIndex as number}.startsAt`}
        >
          Opens at:
        </Label>
        <Input
          {...register(`components.${selectedIndex as number}.startsAt`)}
          className="col-span-4"
          defaultValue={component.startsAt}
          size="sm"
          type="datetime-local"
        />
        {errors.components?.[selectedIndex as number]?.startsAt && (
          <span className="text-destructive select-none justify-end text-xs col-span-2 self-center justify-self-end">
            {errors.components?.[selectedIndex as number]?.startsAt?.message}
          </span>
        )}
      </div>
      <div>
        <div className="grid grid-cols-7 gap-4">
          <Label
            className="self-center"
            htmlFor={`components.${selectedIndex as number}.expiresAt`}
          >
            Closes at:
          </Label>
          <Input
            {...register(`components.${selectedIndex as number}.expiresAt`)}
            className="col-span-4"
            defaultValue={component.expiresAt}
            size="sm"
            type="datetime-local"
          />
          {errors.components?.[selectedIndex as number]?.expiresAt && (
            <span className="text-destructive select-none justify-end text-xs col-span-2 self-center justify-self-end">
              {errors.components?.[selectedIndex as number]?.expiresAt?.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
