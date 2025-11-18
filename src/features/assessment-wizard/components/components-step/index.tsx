'use client';

import { NoDataIllustration } from '@/components/illustrations/no-data-illustration';
import { AssessmentControl } from '@/features/assessment-wizard/components/components-step/assessment-control';
import { ComponentAssignmentsSection } from '@/features/assessment-wizard/components/components-step/assignments-section';
import { ComponentDetailsSection } from '@/features/assessment-wizard/components/components-step/details-section';
import { ComponentResponseWindowSection } from '@/features/assessment-wizard/components/components-step/response-window-section';
import { ComponentSettingsSection } from '@/features/assessment-wizard/components/components-step/settings-section';
import {
  TAssessmentComponentsStepSchema,
  ZAssessmentComponentsStepSchema,
} from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { useMultistepFormContext } from '@/hooks/use-multistep-form-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

export function AssessmentComponentsForm() {
  const { next } = useMultistepFormContext();
  const initialComponents = useAssessmentWizardStore.getState().components;
  const setComponents = useAssessmentWizardStore((s) => s.setComponents);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(0);

  const methods = useForm<TAssessmentComponentsStepSchema>({
    defaultValues: {
      components: initialComponents || [],
    },
    resolver: zodResolver(ZAssessmentComponentsStepSchema),
    shouldUnregister: false,
    shouldFocusError: false,
    reValidateMode: 'onChange',
  });

  const components = useWatch({
    control: methods.control,
    name: 'components',
  });

  const submit = (data: TAssessmentComponentsStepSchema) => {
    setComponents(data.components);
    next();
  };

  return (
    <FormProvider {...methods}>
      <form
        id="current-step"
        onSubmit={methods.handleSubmit(submit)}
        className="flex-grow grid gap-4 grid-cols-7 h-full"
      >
        <div className="col-span-3">
          <AssessmentControl
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
        <div
          key={selectedIndex}
          className="space-y-4 border-l pl-4 col-span-4 pb-4"
        >
          {components.length > 0 ? (
            <>
              <ComponentDetailsSection selectedIndex={selectedIndex} />
              <ComponentAssignmentsSection selectedIndex={selectedIndex} />
              <ComponentResponseWindowSection selectedIndex={selectedIndex} />
              <ComponentSettingsSection selectedIndex={selectedIndex} />
            </>
          ) : (
            <div className="flex h-full flex-col space-y-4 items-center justify-center select-none">
              <NoDataIllustration />
              <div className="text-center">
                <p className="font-medium">No Components</p>
                <p className="font-light">
                  Click &quot;Add Component&quot; to begin.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
