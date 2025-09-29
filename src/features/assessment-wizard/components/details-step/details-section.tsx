'use client';

import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TAssessmentComponentSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { CalendarIcon } from 'lucide-react';


export function ComponentDetailsSection() {
  const selectedComponentId = useAssessmentWizardStore(
    (s) => s.selectedComponentId,
  );

  const component = useAssessmentWizardStore((s) =>
    s.components.find((c) => c.id === (selectedComponentId || '')),
  );

  const updateComponent = useAssessmentWizardStore((s) => s.updateComponent)

  if (!component) {
    return null
  }

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
          <Label>Title</Label>
          <Input
            defaultValue={component.title}
            onChange={(e) => {
              updateComponent(component.id, { title: e.target.value  })
            }}
            size="sm"
            placeholder="Station"
          />
        </div>
        <div>
          <Label>Starts at</Label>
          <Input
            defaultValue={component.startsAt}
            size="sm"
            type="datetime-local"
          />
        </div>
        <div>
          <Label>Expires at</Label>
          <Input
            defaultValue={component.expiresAt}
            size="sm"
            type="datetime-local"
          />
        </div>
      </div>
    </div>
  );
}
