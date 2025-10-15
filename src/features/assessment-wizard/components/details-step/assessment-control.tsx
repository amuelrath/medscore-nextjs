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
import { TAssessmentDetailsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { FORM_TYPE_ICONS } from '@/features/forms-home/data/form-type-data';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { addHours, addMinutes, format } from 'date-fns';
import { motion } from 'framer-motion';
import { BoxesIcon, XIcon } from 'lucide-react';
import { SyntheticEvent } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { v4 } from 'uuid';

const MotionButton = motion.create(Button);

interface AssessmentCardProps {
  index: number;
  setSelectedIndex: (idx: number | undefined) => void;
  selectedIndex: number | undefined;
}

function AssessmentCard({
  index,
  setSelectedIndex,
  selectedIndex,
}: AssessmentCardProps) {
  const {
    data: forms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const {
    control,
    formState: { errors },
  } = useFormContext<TAssessmentDetailsStepSchema>();
  const { fields, remove } = useFieldArray<TAssessmentDetailsStepSchema>({
    control,
    name: 'components',
  });

  const handleRemove = (e?: SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // Determine the new selectedIndex after removal
    if (index === selectedIndex) {
      // If deleting the selected item
      if (fields.length > 1) {
        // If there are other items, select the previous one (or 0 if deleting the first)
        setSelectedIndex(index > 0 ? index - 1 : 0);
      } else {
        // If this is the last item, deselect
        setSelectedIndex(undefined);
      }
    } else if (selectedIndex !== undefined && selectedIndex > index) {
      // Adjust selectedIndex if we're removing an item before it
      setSelectedIndex(selectedIndex - 1);
    }

    remove(index);
  };

  const component = useWatch({
    control,
    name: `components.${index}`,
  });
  if (!component) return null;

  const form = forms?.find((f) => f.id === component.formId);
  const Icon = form ? FORM_TYPE_ICONS[form.type] : null;
  const formTitle = form?.title || 'Form not found';
  const formQuestionCount = form?.formItems.length || 0;
  const isSelected = index === selectedIndex;

  return (
    <MotionButton
      onClick={() => setSelectedIndex(index)}
      onAnimationComplete={(definition) => {
        // Only run on exit animation
        if (definition === 'exit' && index === fields.length - 1) {
          // Call remove again after animation finishes
          handleRemove();
        }
      }}
      type="button"
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      variant="ghost"
      className={cn(
        'w-full h-12 text-sm p-2 flex flex-row items-center border border-transparent hover:border-accent-secondary justify-between group rounded-sm select-none',
        isSelected ? 'bg-primary/5' : 'bg-transparent hover:bg-transparent ',
        errors.components?.[index] && 'outline outline-destructive',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-start transition',
          !isSelected && 'opacity-75 group-hover:opacity-100',
        )}
      >
        <span className="flex items-center space-x-1">
          {Icon && <Icon size={12} />}
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

      <XIcon size={16} className="text-black" onClick={handleRemove} />
    </MotionButton>
  );
}

interface AssessmentControlProps {
  selectedIndex: number | undefined;
  setSelectedIndex: (idx: number | undefined) => void;
}

export function AssessmentControl({
  selectedIndex,
  setSelectedIndex,
}: AssessmentControlProps) {
  const { control } = useFormContext<TAssessmentDetailsStepSchema>();
  const { fields, append } = useFieldArray({
    control,
    name: 'components',
  });

  const handleAddComponent = (formId: string) => {
    const now = Date.now();

    append({
      id: v4(),
      title: '',
      formId,
      startsAt: format(addMinutes(now, -2), "yyyy-MM-dd'T'HH:mm"),
      expiresAt: format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm"),
      multipleResponses: false,
      saveAndQuit: false,
      revisions: false,
    });

    setSelectedIndex(fields.length);
  };

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent className="relative">
          <FormSectionHeaderIcon Icon={BoxesIcon} />
          <FormSectionHeaderTitle>Components</FormSectionHeaderTitle>
          <FormSelectDialogTrigger handleAddComponent={handleAddComponent} />
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <ul className="flex flex-col space-y-2">
        {fields.map((c, index) => (
          <AssessmentCard
            key={c.id}
            index={index}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        ))}
      </ul>
    </div>
  );
}
