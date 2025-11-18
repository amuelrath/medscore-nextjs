'use client';

import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TAssessmentComponentsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { SettingsIcon } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

interface ComponentSettingsSectionProps {
  selectedIndex: number | undefined;
}

export function ComponentSettingsSection({
  selectedIndex,
}: ComponentSettingsSectionProps) {
  const { control } = useFormContext<TAssessmentComponentsStepSchema>();
  const { fields } = useFieldArray<TAssessmentComponentsStepSchema>({
    control,
    name: 'components',
  });

  const component = fields[selectedIndex as number];
  if (!component) return null;

  return (
    <div className="space-y-1 w-full">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={SettingsIcon} />
          <FormSectionHeaderTitle>Response Settings</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div>
        <div>
          <div className="space-y-2 select-none">
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm text-neutral-700">
                  Multiple Responses
                </Label>
                <Controller
                  control={control}
                  name={`components.${selectedIndex as number}.multipleResponses`}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={component.multipleResponses}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      size="md"
                    />
                  )}
                />
              </div>
              <p className="text-sm text-neutral-500">Submit multiple times.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm" variant="medium">
                  Revisions
                </Label>
                <Controller
                  control={control}
                  name={`components.${selectedIndex as number}.revisions`}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={component.revisions}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      size="md"
                    />
                  )}
                />
              </div>
              <p className="text-sm text-neutral-500">Edit after submission.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm" variant="medium">
                  Save & Quit
                </Label>

                <Controller
                  control={control}
                  name={`components.${selectedIndex as number}.saveAndQuit`}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={component.saveAndQuit}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      size="md"
                    />
                  )}
                />
              </div>
              <p className="text-sm text-neutral-500">Complete later.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
