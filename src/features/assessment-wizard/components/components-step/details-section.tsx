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
import { NotebookTabsIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';

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

  const component = useWatch({
    control,
    name: `components.${selectedIndex as number}`,
  });

  if (!component) return null;

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={NotebookTabsIcon} />
          <FormSectionHeaderTitle>Details</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div className="space-y-2">
        <div>
          <Label
            className="flex flex-row justify-between"
            htmlFor={`components.${selectedIndex as number}.title`}
          >
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
      </div>
    </div>
  );
}
