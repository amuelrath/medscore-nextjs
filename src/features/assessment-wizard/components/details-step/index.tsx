'use client';

import { NoDataIllustration } from '@/components/illustrations/no-data-illustration';
import { AssessmentControl } from '@/features/assessment-wizard/components/details-step/assessment-control';
import { ComponentDetailsSection } from '@/features/assessment-wizard/components/details-step/details-section';
import { ComponentSettingsSection } from '@/features/assessment-wizard/components/details-step/settings-section';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';

export function AssessmentDetailsForm() {
  const selectedComponentId = useAssessmentWizardStore(
    (s) => s.selectedComponentId,
  );
  const components = useAssessmentWizardStore((s) => s.components);

  return (
    <form className="flex-grow grid gap-4 grid-cols-7 h-full">
      <div className="col-span-3">
        <AssessmentControl />
      </div>
      <div
        key={selectedComponentId}
        className="space-y-4 border-l pl-4 col-span-4"
      >
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
