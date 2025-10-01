'use client';

import { getAllFormsLite } from '@/actions/forms/get-all-forms-lite';
import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Button } from '@/components/ui/button';
import { FormSelectDialogTrigger } from '@/features/assessment-wizard/components/details-step/form-select-dialog';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BoxesIcon, BoxIcon, XIcon } from 'lucide-react';

const MotionButton = motion.create(Button);

interface AssessmentCardProps {
  index: number;
  componentId: string;
}

function AssessmentCard({ index, componentId }: AssessmentCardProps) {
  const selectedComponentId = useAssessmentWizardStore(
    (s) => s.selectedComponentId,
  );

  const setSelectedComponentId = useAssessmentWizardStore(
    (s) => s.setSelectedComponentId,
  );

  const component = useAssessmentWizardStore((s) =>
    s.components.find((c) => c.id === componentId),
  );

  const removeComponent = useAssessmentWizardStore((s) => s.removeComponent);

  const errors = useAssessmentWizardStore((s) => s.errors);

  const {
    data: forms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  if (!component) {
    return null;
  }

  const form = forms?.find((f) => f.id === component.formId);
  const formTitle = form?.title || 'Form not found';
  const formQuestionCount = form?.formItems.length || 0;
  const isSelected = selectedComponentId === component?.id;

  return (
    <MotionButton
      onClick={() => setSelectedComponentId(componentId)}
      type="button"
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      variant="ghost"
      className={cn(
        'w-full h-12 text-sm p-2 flex flex-row items-center border border-transparent hover:border-accent-secondary justify-between group rounded-sm select-none',
        isSelected ? 'bg-primary/5' : 'bg-transparent hover:bg-transparent ',
        errors[`components.${index}.title`] && 'outline outline-destructive',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-start transition',
          !isSelected && 'opacity-75 group-hover:opacity-100',
        )}
      >
        <span className="flex items-center space-x-1">
          <BoxIcon size={12} />
          <span>
            {truncate(component.title || '', 30) || 'Untitled Component'}
          </span>
        </span>
        <div className="flex space-x-1 text-xs text-neutral-500">
          <span>{truncate(formTitle || '', 35) || 'No Form Selected'}</span>
          <span>•</span>
          <span>{`${formQuestionCount} Questions`}</span>
        </div>
      </div>

      <XIcon
        size={16}
        className="text-black"
        onClick={(e) => {
          e.stopPropagation(); // stop selecting after we delete
          removeComponent(component.id);
        }}
      />
    </MotionButton>
  );
}

export function AssessmentControl() {
  const components = useAssessmentWizardStore((s) => s.components);

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent className="relative">
          <FormSectionHeaderIcon Icon={BoxesIcon} />
          <FormSectionHeaderTitle>Forms</FormSectionHeaderTitle>
          <FormSelectDialogTrigger />
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <ul className="flex flex-col space-y-2">
        {components.map((c, index) => (
          <AssessmentCard key={c.id} index={index} componentId={c.id} />
        ))}
      </ul>
    </div>
  );
}
