'use client';

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
import { useFieldArray, useFormContext } from 'react-hook-form';

interface ComponentDetailsSectionProps {
  selectedIndex: number | undefined;
}

export function ComponentDetailsSection({
  selectedIndex,
}: ComponentDetailsSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TAssessmentComponentsStepSchema>();

  const { fields } = useFieldArray<TAssessmentComponentsStepSchema>({
    control,
    name: 'components',
  });

  const component = fields[selectedIndex as number];
  if (!component) return null;

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={CalendarIcon} />
          <FormSectionHeaderTitle>Details</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div className="space-y-2">
        <div>
          <Label className="flex flex-row justify-between">
            Title{' '}
            {errors.components?.[selectedIndex as number]?.title && (
              <span className="text-destructive justify-end">
                {errors.components?.[selectedIndex as number]?.title?.message}
              </span>
            )}
          </Label>
          <Input
            {...register(`components.${selectedIndex as number}.title`)}
            defaultValue={component.title}
            size="sm"
            placeholder={`Station ${(selectedIndex as number) + 1}`}
          />
        </div>
        <div>
          <Label className="flex flex-row justify-between">
            Starts at{' '}
            {errors.components?.[selectedIndex as number]?.startsAt && (
              <span className="text-destructive justify-end">
                {
                  errors.components?.[selectedIndex as number]?.startsAt
                    ?.message
                }
              </span>
            )}
          </Label>
          <Input
            {...register(`components.${selectedIndex as number}.startsAt`)}
            defaultValue={component.startsAt}
            size="sm"
            type="datetime-local"
          />
        </div>
        <div>
          <Label className="flex flex-row justify-between">
            Expires at{' '}
            {errors.components?.[selectedIndex as number]?.expiresAt && (
              <span className="text-destructive justify-end">
                {
                  errors.components?.[selectedIndex as number]?.expiresAt
                    ?.message
                }
              </span>
            )}
          </Label>
          <Input
            {...register(`components.${selectedIndex as number}.expiresAt`)}
            defaultValue={component.expiresAt}
            size="sm"
            type="datetime-local"
          />
        </div>
      </div>
    </div>
  );
}
