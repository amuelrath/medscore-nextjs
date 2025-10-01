'use client';

import { NoDataIllustration } from '@/components/illustrations/no-data-illustration';
import { AssessmentControl } from '@/features/assessment-wizard/components/details-step/assessment-control';
import { ComponentDetailsSection } from '@/features/assessment-wizard/components/details-step/details-section';
import { ComponentSettingsSection } from '@/features/assessment-wizard/components/details-step/settings-section';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { FormEvent } from 'react';
import { ZAssessmentDetailsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';

export function AssessmentDetailsForm() {
  const components = useAssessmentWizardStore((s) => s.components);
  const setErrors = useAssessmentWizardStore((s) => s.setErrors)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = ZAssessmentDetailsStepSchema.safeParse({ components });
    setErrors(result.error)
    console.log(result);
  };

  return (
    <form
      id="current-step"
      onSubmit={handleSubmit}
      className="flex-grow grid gap-4 grid-cols-7 h-full"
    >
      <div className="col-span-3">
        <AssessmentControl />
      </div>
      <div className="space-y-4 border-l pl-4 col-span-4">
        {components.length > 0 ? (
          <>
            <ComponentDetailsSection />
            <ComponentSettingsSection />
          </>
        ) : (
          <div className="flex h-full flex-col space-y-4 items-center justify-center">
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
  );
}
