'use client';

import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import EasyTooltip from '@/components/ui/easy-tooltip';
import { Label } from '@/components/ui/label';
import { UserSelect } from '@/components/ui/user-select';
import { TAssessmentComponentsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import {
  FORM_TYPE_ASSIGNMENT_DESCRIPTIONS,
  FORM_TYPE_ICONS,
} from '@/features/forms-home/data/form-type-data';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-letter';
import { UsersRoundIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';

interface ContentProps {
  formId: string | undefined;
  selectedIndex: number | undefined;
}

function StationContent({ formId, selectedIndex }: ContentProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TAssessmentComponentsStepSchema>();

  const usedRespondeeIds = useWatch({
    control,
    name: `components.${selectedIndex as number}.respondeeIds`,
  });

  const usedEvaluateeIds = useWatch({
    control,
    name: `components.${selectedIndex as number}.evaluateeIds`,
  });

  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`components.${selectedIndex as number}.respondeeIds`}>
          Evaluators
        </Label>
        <UserSelect
          size="md"
          disabledIds={usedEvaluateeIds ? [...usedEvaluateeIds] : []}
          formId={formId}
          control={control}
          name={`components.${selectedIndex as number}.respondeeIds`}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`components.${selectedIndex as number}.evaluateeIds`}>
          Evaluatees
        </Label>
        <UserSelect
          size="md"
          disabledIds={usedRespondeeIds ? [...usedRespondeeIds] : []}
          formId={formId}
          control={control}
          placeholder="Enter Evaluatee Name or Role..."
          name={`components.${selectedIndex as number}.evaluateeIds`}
        />
      </div>
      <div className="flex flex-col justify-end select-none text-end" >
      {(errors.components?.[selectedIndex as number]?.respondeeIds ||
        errors.components?.[selectedIndex as number]?.evaluateeIds) && (
        <span className="text-destructive text-xs" >
          At least one evaluatee and evaluator required.
        </span>
      )}
      </div>
    </div>
  );
}

function SurveyContent({ formId, selectedIndex }: ContentProps) {
  const { control, formState: { errors } } = useFormContext<TAssessmentComponentsStepSchema>();

  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`components.${selectedIndex as number}.respondeeIds`}>
          Respondents
        </Label>
        <UserSelect
          size="md"
          formId={formId}
          control={control}
          name={`components.${selectedIndex as number}.respondeeIds`}
        />
      </div>
      <div className="col-start-3 flex flex-col justify-end text-end">
        {(errors.components?.[selectedIndex as number]?.respondeeIds && (
          <span className="text-destructive select-none text-xs">
          At least one respondent required.
        </span>
        ))}
      </div>
    </div>
  );
}

// here in case we need to make it separate later on
function EvaluationContent({ formId, selectedIndex }: ContentProps) {
  const { control } = useFormContext<TAssessmentComponentsStepSchema>();

  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`components.${selectedIndex as number}.respondeeIds`}>
          Evaluators
        </Label>
        <UserSelect
          size="md"
          // disabledIds={[...evaluateeIds, ...usedRespondeeIds]}
          formId={formId}
          control={control}
          name={`components.${selectedIndex as number}.respondeeIds`}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`components.${selectedIndex as number}.evaluateeIds`}>
          Evaluatees
        </Label>
        <UserSelect
          //  disabledIds={currentRespondeeId ? [currentRespondeeId] : []}
          formId={formId}
          size="md"
          control={control}
          placeholder="Enter Evaluatee Name or Role..."
          name={`components.${selectedIndex as number}.evaluateeIds`}
        />
      </div>
    </div>
  );
}
interface ComponentAssignmentsSectionProps {
  selectedIndex: number | undefined;
}

export function ComponentAssignmentsSection({
  selectedIndex,
}: ComponentAssignmentsSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TAssessmentComponentsStepSchema>();

  const component = useWatch({
    control,
    name: `components.${selectedIndex as number}`,
  });

  // sometimes we get an err that type is undefined when adding a component
  // i think this is some race condition with selectedIndex
  if (!component || !component.type) return null;

  const Icon = FORM_TYPE_ICONS[component.type];


  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent className="relative">
          <FormSectionHeaderIcon Icon={UsersRoundIcon} />
          <FormSectionHeaderTitle className="flex flex-row justify-between w-full">
            <span>Assignments</span>
            <EasyTooltip
              position="right"
              delay={0}
              tooltipContent={
                FORM_TYPE_ASSIGNMENT_DESCRIPTIONS[component.type] ?? ''
              }
            >
              <span className="flex flex-row space-x-2 text-neutral-500 items-center">
                <Icon size={16} className="opacity-50" />
                <span >
                  {capitalizeFirstLetter(component.type)}
                </span>
              </span>
            </EasyTooltip>
          </FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div>
        {component.type === 'STATION' && (
          <StationContent
            formId={component.formId}
            selectedIndex={selectedIndex}
          />
        )}
        {component.type === 'EVALUATION' && (
          <StationContent
            formId={component.formId}
            selectedIndex={selectedIndex}
          />
        )}
        {component.type === 'SURVEY' && (
          <SurveyContent
            formId={component.formId}
            selectedIndex={selectedIndex}
          />
        )}
      </div>
    </div>
  );
}
