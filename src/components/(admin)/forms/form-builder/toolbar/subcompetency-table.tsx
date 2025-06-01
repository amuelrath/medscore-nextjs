import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { PassingScoreInput } from '@/components/(admin)/forms/form-builder/toolbar/passing-score-input';
import {
  isChoiceItem,
  isRangeItem,
  TFormBuilderSettingsSchema,
  ZPassingCriteriaSchema,
} from '@/components/(admin)/forms/form-builder/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InfoTooltip, InfoTooltipContent } from '@/components/ui/info-tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Milestone } from '@/db/schema';
import { COMPETENCIES } from '@/lib/constants/common';
import { cn } from '@/lib/helpers/utils';
import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from 'lucide-react';
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

export const ZPassingScoreFormSchema = z.object({
  passingCriteria: ZPassingCriteriaSchema,
});

type TPassingScoreFormSchema = z.infer<typeof ZPassingScoreFormSchema>;

const createAndMergePassingCriteriaSettings = (
  subcompetencies: SubcompetencyResult,
  existingCriteria: TFormBuilderSettingsSchema['passingCriteria'] | undefined,
): TPassingScoreFormSchema => ({
  passingCriteria: subcompetencies.map((sub) => {
    // Find existing criteria for this subcompetency
    const existingSubCriteria = existingCriteria?.find(
      (criteria) => criteria.subcompetencyId === sub.id,
    );

    // Get unique levels for this subcompetency
    const uniqueLevels = Array.from(
      new Set(sub.milestones.map((m) => m.level)),
    ).sort((a, b) => a - b);

    return {
      subcompetencyId: sub.id,
      // Use existing threshold or default to 0.5
      threshold: existingSubCriteria?.threshold ?? 0.5,
      levelThresholds: uniqueLevels.map((level) => ({
        level,
        // Find existing threshold for this level or default to 0.5
        threshold:
          existingSubCriteria?.levelThresholds.find((lt) => lt.level === level)
            ?.threshold ?? 0.5,
      })),
    };
  }),
});

interface SubcompetencyAccordionProps {
  subcompetencies: SubcompetencyResult;
}

export function SubcompetencyAccordion({
  subcompetencies,
}: SubcompetencyAccordionProps) {
  const { settings, setSettings, items } = useFormBuilderStore();

  // Get used milestone IDs from form items
  const usedMilestoneIds = items
    .filter((i) => isChoiceItem(i) || isRangeItem(i))
    .flatMap((i) => i.milestoneIds)
    .filter((i) => i !== undefined);

  // Filter subcompetencies that have at least one used milestone
  const usedSubcompetencies = subcompetencies.filter((sub) =>
    sub.milestones.some((milestone) => usedMilestoneIds.includes(milestone.id)),
  );

  // Initialize the form with only used subcompetencies
  const { control, watch, handleSubmit } = useForm<TPassingScoreFormSchema>({
    defaultValues: createAndMergePassingCriteriaSettings(
      usedSubcompetencies,
      settings.passingCriteria,
    ),
    resolver: zodResolver(ZPassingScoreFormSchema),
  });

  const { fields } = useFieldArray<TPassingScoreFormSchema>({
    control,
    name: 'passingCriteria',
  });

  // Watch the form values to get the current data
  const formValues = watch('passingCriteria');

  const submitForm = (data: TPassingScoreFormSchema) => {
    setSettings({ ...settings, passingCriteria: data.passingCriteria });
  };

  return (
    <form id="passing-criteria-form" onSubmit={handleSubmit(submitForm)}>
      <Accordion type="multiple" className="space-y-4 py-2 duration-700">
        {fields.map((field, index) => (
          <SubcompetencyAccordionItem
            key={field.id}
            index={index}
            control={control}
            subcompetency={
              usedSubcompetencies.find(
                (sub) => sub.id === formValues[index].subcompetencyId,
              )!
            }
            usedMilestoneIds={usedMilestoneIds}
          />
        ))}
      </Accordion>
    </form>
  );
}

const getSubcompetencyAttributes = (
  subcompetency: SubcompetencyResult[number],
) => ({
  id: subcompetency.id,
  competencyAbbrev: Object.values(COMPETENCIES).find(
    (c) => c.id === subcompetency.competencyId,
  )!.abbrev,
  subcompetencyLevel: subcompetency.level,
  subcompetencyName: subcompetency.name,
  groupedMilestonesByLevel: new Map(
    Object.entries(
      subcompetency.milestones.reduce(
        (acc, milestone) => {
          if (!acc[milestone.level]) {
            acc[milestone.level] = [];
          }
          acc[milestone.level].push(milestone);
          return acc;
        },
        {} as Record<number, Milestone[]>,
      ),
    ).sort(([a], [b]) => Number(a) - Number(b)),
  ),
});

interface SubcompetencyAccordionItemProps {
  index: number;
  control: Control<TPassingScoreFormSchema>;
  subcompetency: SubcompetencyResult[number];
  usedMilestoneIds: string[];
}

function SubcompetencyAccordionItem({
  index,
  control,
  subcompetency,
  usedMilestoneIds,
}: SubcompetencyAccordionItemProps) {
  // This fields array represents levelThresholds
  const { fields: levelThresholdFields } =
    useFieldArray<TPassingScoreFormSchema>({
      control,
      name: `passingCriteria.${index}.levelThresholds`,
    });

  // Watch the specific threshold value we need
  const currentThreshold = useWatch({
    control,
    name: `passingCriteria.${index}.threshold`,
  });

  const {
    id,
    subcompetencyName,
    subcompetencyLevel,
    competencyAbbrev,
    groupedMilestonesByLevel,
  } = getSubcompetencyAttributes(subcompetency);

  return (
    <AccordionItem
      value={id}
      className="flex snap-start min-h-[60px] data-[state=open]:max-h-[450px] text-xs flex-col p-2 rounded border"
    >
      <AccordionTrigger className="px-1 py-2  font-semibold text-lg">
        {`${competencyAbbrev} ${subcompetencyLevel}: ${subcompetencyName}`}
      </AccordionTrigger>
      <AccordionContent>
        <div
          className="grid w-full divide-x"
          style={{
            gridTemplateColumns: `repeat(${groupedMilestonesByLevel.size}, minmax(0, 1fr))`,
          }}
        >
          {levelThresholdFields.map((_, levelIndex) => (
            <SubcompetencyLevel
              key={levelIndex}
              index={index}
              levelIndex={levelIndex}
              numberOfLevels={groupedMilestonesByLevel.size}
              control={control}
              milestones={
                groupedMilestonesByLevel.get((levelIndex + 1).toString())!
              }
              usedMilestoneIds={usedMilestoneIds}
            />
          ))}
        </div>
        <div className="font-medium flex flex-row items-center justify-between text-md rounded-sm mt-2 bg-primary/90 text-white p-2">
          <div className="flex flex-row items-center space-x-2">
            <InfoTooltip>
              <InfoTooltipContent>
                To achieve competence in{' '}
                <b>
                  {competencyAbbrev} {subcompetencyLevel}
                </b>
                , the candidate must score{' '}
                <b> above {`${(currentThreshold || 0) * 100}%`}</b>. This sets
                the minimum performance requirement for this competency level.
              </InfoTooltipContent>
            </InfoTooltip>
            <p>Overall Passing Score</p>
          </div>

          <Controller
            control={control}
            name={`passingCriteria.${index}.threshold`}
            render={({ field }) => (
              <PassingScoreInput
                {...field}
                value={Math.fround(field.value * 100)}
                onChange={(e) => field.onChange(Math.fround(Number(e.target.value) / 100))}
                className="text-white"
              />
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface SubcompetencyLevelProps {
  index: number;
  levelIndex: number;
  numberOfLevels: number;
  control: Control<TPassingScoreFormSchema>;
  milestones: Milestone[];
  usedMilestoneIds: string[];
}

function SubcompetencyLevel({
  index,
  control,
  levelIndex,
  milestones,
  numberOfLevels,
  usedMilestoneIds,
}: SubcompetencyLevelProps) {
  return (
    <div key={levelIndex} className="flex flex-col justify-between">
      <p
        className={cn(
          'font-medium text-center mb-2 bg-primary/5 p-2',
          levelIndex === 0 && 'rounded-l-sm',
          levelIndex === numberOfLevels - 1 && 'rounded-r-sm',
        )}
      >
        Level {levelIndex + 1}
      </p>
      <ScrollArea className="h-[240px] justify-start flex-grow ">
        {milestones.map((m) => (
          <li
            key={m.id}
            className="text-xs mb-2 flex flex-row items-center p-1 pr-[24px] text-gray-600"
          >
            <div className="flex-shrink-0 w-[16px] mr-2">
              <CheckIcon
                size={16}
                strokeWidth={3}
                className={cn(
                  usedMilestoneIds.includes(m.id)
                    ? 'opacity-100 text-accent-secondary'
                    : 'opacity-0',
                )}
              />
            </div>
            <span className="flex-1 hyphens-auto">{m.description}</span>
          </li>
        ))}
      </ScrollArea>
      <div
        className={cn(
          'font-medium text-xs mt-2 bg-primary/20 p-2 flex flex-row items-center justify-between',
          levelIndex === 0 && 'rounded-l-sm',
          levelIndex === numberOfLevels - 1 && 'rounded-r-sm',
        )}
      >
        <Controller
          control={control}
          name={`passingCriteria.${index}.levelThresholds.${levelIndex}.threshold`}
          render={({ field }) => (
            <>
              <div className="flex flex-row items-center space-x-2">
                <InfoTooltip>
                  <InfoTooltipContent>
                    To achieve <b>Level {levelIndex + 1}</b>, the candidate must
                    score
                    <b> above {`${Math.fround(field.value * 100)}%`}</b>. This sets the
                    minimum performance requirement for this proficiency level.
                  </InfoTooltipContent>
                </InfoTooltip>
                <p>Passing Score</p>
              </div>
              <PassingScoreInput
                ref={field.ref}
                value={Math.fround(field.value * 100)}
                onChange={(e) => field.onChange(Math.fround(Number(e.target.value) / 100))}
              />
            </>
          )}
        />
      </div>
    </div>
  );
}
