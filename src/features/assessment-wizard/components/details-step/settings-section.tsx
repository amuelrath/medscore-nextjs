'use client';

import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TAssessmentComponentSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { SettingsIcon } from 'lucide-react';

export function ComponentSettingsSection() {
  const selectedComponentId = useAssessmentWizardStore(
    (s) => s.selectedComponentId,
  );

  const component = useAssessmentWizardStore((s) =>
    s.components.find((c) => c.id === (selectedComponentId || '')),
  );

  const updateComponent = useAssessmentWizardStore((s) => s.updateComponent);

  if (!component) {
    return null;
  }

  return (
    <div key={component.id} className="space-y-1 w-full">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={SettingsIcon} />
          <FormSectionHeaderTitle>Settings</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div>
        <div>
          <div className="space-y-2">
            <div className="flex flex-col">
              <Label>Response Options</Label>
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm text-neutral-700">
                  Multiple Responses
                </Label>

                <Switch
                  defaultChecked={component.multipleResponses}
                  onCheckedChange={(checked) =>
                    updateComponent(component.id, {
                      multipleResponses: checked,
                    })
                  }
                  size="md"
                />
              </div>
              <p className="text-sm font-light">Submit multiple times.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm" variant="medium">
                  Revisions
                </Label>

                <Switch
                  defaultChecked={component.revisions}
                  onCheckedChange={(checked) =>
                    updateComponent(component.id, { revisions: checked })
                  }
                  size="md"
                />
              </div>
              <p className="text-sm font-light">Edit after submission.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm" variant="medium">
                  Save & Quit
                </Label>

                <Switch
                  defaultChecked={component.saveAndQuit}
                  onCheckedChange={(checked) =>
                    updateComponent(component.id, { saveAndQuit: checked })
                  }
                  size="md"
                />
              </div>
              <p className="text-sm font-light">Complete later.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
