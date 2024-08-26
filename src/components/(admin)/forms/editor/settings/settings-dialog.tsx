// SettingsDialog.tsx
import { TFormSchema } from '@/components/(admin)/forms/editor/hooks/use-form-builder';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EasyTooltip from '@/components/ui/easy-tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ProgramRole, TFormType } from '@/db/schema';
import { useFormResultInEditor } from '@/hooks/queries/use-form-result-in-editor';
import { useGetSubcompetenciesInEditor } from '@/hooks/queries/use-get-form-subcompetencies';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-letter';
import { COMPETENCIES } from '@/lib/constants/common';
import { cn } from '@/lib/helpers/utils';
import { motion, useScroll } from 'framer-motion';
import {
  BarChartIcon,
  FileTextIcon,
  InfoIcon,
  MessageSquareIcon,
  MinusIcon,
  PlusIcon,
  SettingsIcon,
  WeightIcon,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

type TSettingsTabs = 'GENERAL' | 'RESPONSES' | 'SCORES' | 'WEIGHTS';

// Utility Components
const Section: React.FC<{ children: React.ReactNode; id: TSettingsTabs }> = ({
  children,
  id,
}) => <motion.section id={id}>{children}</motion.section>;

// Tab Components
const tabNames: TSettingsTabs[] = ['GENERAL', 'RESPONSES', 'SCORES', 'WEIGHTS'];

const tabIcons = {
  GENERAL: FileTextIcon,
  RESPONSES: MessageSquareIcon,
  SCORES: BarChartIcon,
  WEIGHTS: WeightIcon,
};

const SettingsTabs: React.FC<{
  activeTab: TSettingsTabs;
  setActiveTab: (tab: TSettingsTabs) => void;
}> = ({ activeTab, setActiveTab }) => (
  <div className="flex-grow flex flex-col space-y-2 items-start">
    {tabNames.map((name: TSettingsTabs) => {
      const formattedName = capitalizeFirstLetter(name);
      const Icon = tabIcons[name];
      return (
        <Button
          onClick={() => setActiveTab(name)}
          variant="hide"
          type="button"
          className={cn(
            'text-neutral-700 justify-start flex w-full rounded-md transition-colors',
            activeTab === name
              ? 'bg-primary/5 '
              : 'hover:bg-primary/5 text-neutral-500',
          )}
          key={name}
        >
          <Icon size={18} className="mr-2" />
          {formattedName}
        </Button>
      );
    })}
  </div>
);

// Main SettingsDialog Component
export function SettingsDialog() {
  const { getValues, control } = useFormContext<TFormSchema>();
  const formType = getValues('type') as TFormType;
  const [activeTab, setActiveTab] = useState<TSettingsTabs>('GENERAL');
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (tab: TSettingsTabs) => {
    const element = document.getElementById(tab);
    if (element && contentRef.current) {
      const yOffset = element.offsetTop - contentRef.current.offsetTop;
      contentRef.current.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <div className="flex flex-row items-center space-x-2">
            <SettingsIcon size={16} />
            <span className="font-semibold">Settings</span>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent
        noCloseButton
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex h-[80vh] max-h-[600px] min-w-[900px] flex-col"
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow grid grid-cols-7 gap-4 overflow-hidden">
            <div className="col-span-2 flex h-full flex-col space-y-4 rounded-lg">
              <DialogHeader className="w-full">
                <DialogTitle className="w-full text-xl">Settings</DialogTitle>
                <DialogDescription>Configure your form</DialogDescription>
              </DialogHeader>
              <SettingsTabs
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  scrollToSection(tab);
                }}
              />
            </div>

            <div
              ref={contentRef}
              className="col-span-5 flex flex-col h-full overflow-y-auto pr-4"
            >
              <SettingsContent
                formType={formType}
                control={control}
                setActiveTab={setActiveTab}
                contentRef={contentRef}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// SettingsContent Component
function SettingsContent({
  formType,
  control,
  setActiveTab,
  contentRef,
}: {
  formType: TFormType;
  control: Control<TFormSchema>;
  setActiveTab: (tab: TSettingsTabs) => void;
  contentRef: React.RefObject<HTMLDivElement>;
}) {
  const { formResult, isLoading } = useFormResultInEditor();

  const { scrollY } = useScroll({ container: contentRef });

  useEffect(() => {
    const handleScroll = () => {
      const sections = tabNames.map((tab) => document.getElementById(tab));
      const scrollPosition = scrollY.get();

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition + 50) {
          setActiveTab(tabNames[i]);
          break;
        }
      }
    };

    const unsubscribe = scrollY.on('change', handleScroll);
    return () => unsubscribe();
  }, [scrollY, setActiveTab]);

  const programRoles: ProgramRole[] =
    formResult?.programs.roles.filter((r) => !r.isStudent) || [];

  if (isLoading) return <Skeleton className="w-full h-full" />;

  return (
    <div className="space-y-16 pb-72">
      {tabNames.map((tab) => (
        <Section key={tab} id={tab}>
          <h3 className="text-lg mb-4 font-semibold leading-none">
            {capitalizeFirstLetter(tab)}
          </h3>
          <div>
            {tab === 'GENERAL' && (
              <GeneralSettings control={control} type={formType} />
            )}
            {tab === 'RESPONSES' && <ResponseSettings control={control} />}
            {tab === 'SCORES' && (
              <ScoreSettings
                control={control}
                type={formType}
                programRoles={programRoles}
              />
            )}
            {tab === 'WEIGHTS' && (
              <RoleWeightSettings
                control={control}
                roles={programRoles}
                type={formType}
              />
            )}
          </div>
        </Section>
      ))}
    </div>
  );
}

// Reusable Components
type SettingTooltipProps = {
  title: string;
  type: 'description' | 'enabledDisabled';
  description?: string;
  enabledDescription?: string;
  disabledDescription?: string;
};

function SettingTooltip({
  title,
  type,
  description,
  enabledDescription,
  disabledDescription,
}: SettingTooltipProps) {
  const content = (
    <div className="flex flex-col space-y-2 max-w-xs">
      <h6 className="font-semibold underline">{title}</h6>
      {type === 'description' ? (
        <p className="font-light">{description}</p>
      ) : (
        <>
          <div>
            <strong className="font-medium">Enabled:</strong>
            <p className="font-light">{enabledDescription}</p>
          </div>
          <div>
            <strong className="font-medium">Disabled:</strong>
            <p className="font-light">{disabledDescription}</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <EasyTooltip tooltipContent={content}>
      <InfoIcon
        size={16}
        className="opacity-50 hover:opacity-100 transition-opacity"
      />
    </EasyTooltip>
  );
}

interface SwitchSettingProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  description?: React.ReactNode;
  disabled?: boolean;
}

function SwitchSetting({
  label,
  value,
  onChange,
  description,
  disabled,
}: SwitchSettingProps) {
  return (
    <div
      className={cn(
        'w-full transition-colors flex flex-row items-center justify-between',
        disabled && 'opacity-50',
      )}
    >
      <div className="flex items-center space-x-2">
        <Label className="font-medium">{label}</Label>
        {description}
      </div>
      <Switch
        disabled={disabled}
        defaultChecked={value}
        onCheckedChange={onChange}
      />
    </div>
  );
}

type Option = {
  label: React.ReactNode;
  value: string;
};

interface SelectSettingProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  description?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

function SelectSetting({
  label,
  value,
  options,
  onChange,
  placeholder,
  description,
  disabled,
}: SelectSettingProps) {
  return (
    <div
      className={cn(
        'w-full transition-colors flex flex-row items-center justify-between',
        disabled && 'opacity-50',
      )}
    >
      <div className="flex items-center space-x-2">
        <Label className="font-medium">{label}</Label>
        {description}
      </div>
      <div className="w-1/2">
        <Select
          disabled={disabled}
          defaultValue={value}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Settings Section Components
const accessOptions = [
  { label: 'Just Me', value: 'JUST_ME' },
  { label: 'Faculty in my Program', value: 'FACULTY_IN_PROGRAM' },
  { label: 'Faculty I choose', value: 'FACULTY_I_CHOOSE' },
];

function GeneralSettings({
  type,
  control,
}: {
  type: TFormType;
  control: Control<TFormSchema>;
}) {
  return (
    <div className="space-y-4 p-4 rounded-md border">
      <Controller
        control={control}
        name="settings.editAccess"
        render={({ field }) => (
          <SelectSetting
            label="Who Can Edit this Form"
            placeholder="Access Options"
            value={field.value}
            options={accessOptions}
            onChange={field.onChange}
          />
        )}
      />
      <hr />
      <Controller
        control={control}
        name="settings.administerAccess"
        render={({ field }) => (
          <SelectSetting
            label="Who Can Administer This Form"
            placeholder="Access Options"
            value={field.value}
            options={accessOptions}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

function ResponseSettings({ control }: { control: Control<TFormSchema> }) {
  return (
    <div className="space-y-4 p-4 rounded-md border">
      <Controller
        control={control}
        name="settings.allowResponseRevisions"
        render={({ field }) => (
          <SwitchSetting
            label="Allow Revisions"
            value={field.value}
            description={
              <SettingTooltip
                type="enabledDisabled"
                title="Revisions"
                enabledDescription="Answers can be changed after submission by the respondee. Changed answers will be labeled and can be reverted."
                disabledDescription="Responses cannot be changed after submission."
              />
            }
            onChange={field.onChange}
          />
        )}
      />
      <hr />
      <Controller
        control={control}
        name="settings.allowResponseSaveAndQuit"
        render={({ field }) => (
          <SwitchSetting
            label="Allow Save & Quit"
            value={field.value}
            onChange={field.onChange}
            description={
              <SettingTooltip
                type="enabledDisabled"
                title="Save & Quit"
                enabledDescription="Responses do not have to be finished at once, and can be completed at any time."
                disabledDescription="Responses must be submitted at once."
              />
            }
          />
        )}
      />
      <hr />
      <Controller
        control={control}
        name="settings.allowMultipleSubmissions"
        render={({ field }) => (
          <SwitchSetting
            label="Allow Multiple Submissions"
            description={
              <SettingTooltip
                type="enabledDisabled"
                title="Multiple Submissions"
                enabledDescription="One person may submit multiple responses to this form."
                disabledDescription="One person may only submit one response to this form."
              />
            }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

function ScoreSettings({
  type,
  control,
  programRoles,
}: {
  type: TFormType;
  control: Control<TFormSchema>;
  programRoles: ProgramRole[];
}) {
  const disabled = type === 'SURVEY';
  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 rounded-md border">
        <Controller
          control={control}
          name="settings.scoresAffectGrades"
          render={({ field }) => (
            <SwitchSetting
              label="Scores Affect Grades"
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
              description={
                <SettingTooltip
                  type="enabledDisabled"
                  title="Scores Affect Grades"
                  enabledDescription="Resulting scores will affect the trainee's portfolio."
                  disabledDescription="Resulting scores will not affect the trainee's portfolio"
                />
              }
            />
          )}
        />
      </div>
      <PassingCriteriaSettings control={control} type={type} />
    </div>
  );
}

// Utility functions
const MAX_PRECISION = 2; // Maximum number of decimal places

function formatWeight(weight: number): string {
  // Round down to MAX_PRECISION decimal places
  const rounded =
    Math.floor(weight * 10 ** MAX_PRECISION) / 10 ** MAX_PRECISION;
  // Format as string with fixed precision
  return rounded.toFixed(MAX_PRECISION);
}

// Custom hook for managing wTeights
function useWeights(control: Control<TFormSchema>, roles: ProgramRole[]) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'settings.roleWeights',
  });

  const weights = useWatch({
    control,
    name: 'settings.roleWeights',
  });

  const [localWeights, setLocalWeights] = useState<string[]>(
    weights.map((w) => formatWeight(w.weight || 0)),
  );

  useEffect(() => {
    setLocalWeights(weights.map((w) => formatWeight(w.weight || 0)));
  }, [weights]);

  const recalculateWeights = useCallback(
    (
      newWeights: { roleId: string; weight: number }[],
      changedIndex: number,
    ) => {
      const total = newWeights.reduce(
        (sum, w, i) => (i !== changedIndex ? sum + w.weight : sum),
        0,
      );
      const changedWeight = newWeights[changedIndex].weight;

      if (total + changedWeight > 1) {
        const availableWeight = 1 - changedWeight;
        const factor = availableWeight / total;

        return newWeights.map((w, i) =>
          i === changedIndex
            ? { ...w, weight: parseFloat(formatWeight(w.weight)) }
            : {
                ...w,
                weight: parseFloat(
                  formatWeight(Math.max(0, w.weight * factor)),
                ),
              },
        );
      }

      return newWeights.map((w) => ({
        ...w,
        weight: parseFloat(formatWeight(w.weight)),
      }));
    },
    [],
  );

  const handleWeightChange = useCallback((value: string, index: number) => {
    setLocalWeights((prev) => {
      const newLocalWeights = [...prev];
      newLocalWeights[index] = value;
      return newLocalWeights;
    });
  }, []);

  const handleWeightBlur = useCallback(
    (index: number) => {
      let numValue = parseFloat(localWeights[index]);

      if (isNaN(numValue) || numValue < 0) {
        numValue = 0;
      } else if (numValue > 1) {
        numValue = 1;
      }

      const newWeights = weights.map((w, i) =>
        i === index ? { ...w, weight: numValue } : w,
      );

      const recalculatedWeights = recalculateWeights(newWeights, index);
      recalculatedWeights.forEach((w, i) => update(i, w));

      setLocalWeights(recalculatedWeights.map((w) => formatWeight(w.weight)));
    },
    [weights, update, localWeights, recalculateWeights],
  );

  const addRule = useCallback(() => {
    const usedRoleIds = new Set(weights.map((r) => r.roleId));
    const unusedRole = roles.find((role) => !usedRoleIds.has(role.id));

    if (unusedRole) {
      append({
        roleId: unusedRole.id,
        weight: 0,
      });
      setLocalWeights((prev) => [...prev, formatWeight(0)]);
    }
  }, [weights, roles, append]);

  return {
    fields,
    localWeights,
    weights,
    handleWeightChange,
    handleWeightBlur,
    addRule,
    remove,
    totalWeight: weights.reduce((sum, w) => sum + (w.weight || 0), 0),
  };
}

// WeightSettings component
function RoleWeightSettings({
  control,
  roles,
  type,
}: {
  control: Control<TFormSchema>;
  roles: ProgramRole[];
  type: TFormType;
}) {
  const {
    fields,
    localWeights,
    handleWeightChange,
    handleWeightBlur,
    addRule,
    remove,
    weights,
    totalWeight,
  } = useWeights(control, roles);

  return (
    <div
      className={cn(
        'w-full p-4 border rounded-md transition-colors flex flex-col space-y-4',
      )}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <Label className="font-medium">Evaluator Role Weights</Label>
          <SettingTooltip
            title="Role Weights"
            type="description"
            description="Define score multipliers for different roles. Scores with no multipliers will not be affected."
          />
        </div>
        <Button
          onClick={addRule}
          disabled={fields.length === roles.length}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <PlusIcon size={12} />
          <span>New Rule</span>
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between w-full"
          >
            <div className="flex space-x-4 w-full">
              <Controller
                control={control}
                name={`settings.roleWeights.${index}.roleId`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[20rem]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => {
                        const isUsed = weights
                          .map((w) => w.roleId)
                          .includes(role.id);
                        return (
                          <SelectItem
                            key={role.id}
                            value={role.id}
                            disabled={isUsed}
                          >
                            {role.roleName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                className="w-[6rem] text-center font-mono text-lg"
                placeholder="0-1"
                value={localWeights[index]}
                onChange={(e) => handleWeightChange(e.target.value, index)}
                onBlur={() => handleWeightBlur(index)}
              />
            </div>
            <Button
              className="hover:opacity-100 opacity-50 hover:bg-transparent border rounded-md border-neutral-200 hover:border-neutral-500 transition-opacity"
              onClick={() => remove(index)}
              size="xs"
              variant="outline"
            >
              <MinusIcon size={16} />
            </Button>
          </div>
        ))}
      </div>
      <div className="text-sm select-none flex flex-row space-x-1 items-center text-gray-500">
        <p>Total Weight:</p>
        <p
          className={cn(
            totalWeight !== 1 ? 'text-destructive' : 'text-emerald-400',
          )}
        >
          {formatWeight(totalWeight)}
        </p>
      </div>
    </div>
  );
}

const ASPECTS = ['OVERALL', 'ICS', 'MK', 'SBP', 'PBLI', 'PC', 'PROF'];
type TAspect = 'OVERALL' | 'ICS' | 'MK' | 'SBP' | 'PBLI' | 'PC' | 'PROF';

function PassingCriteriaSettings({
  control,
  type,
}: {
  control: Control<TFormSchema>;
  type: TFormType;
}) {
  const { formResult, isLoading: isFormLoading } = useFormResultInEditor();
  const { subcompetencies, isLoading: isSubcompetenciesLoading } =
    useGetSubcompetenciesInEditor();

  // Figure out which competencies this form tests
  const questionMilestoneIds = useMemo(
    () =>
      formResult?.formItems.flatMap((i) =>
        i.milestones.map((m) => m.milestoneId),
      ) || [],
    [formResult?.formItems],
  );

  const relevantSubcompetencies = useMemo(
    () =>
      subcompetencies?.filter((sc) =>
        sc.milestones.some((m) => questionMilestoneIds.includes(m.id)),
      ) || [],
    [questionMilestoneIds],
  );

  const relevantCompetencyIds = useMemo(
    () => [...new Set(relevantSubcompetencies.map((sc) => sc.competencyId))],
    [relevantSubcompetencies],
  );

  // Get the relevant aspects (competency abbreviations)
  const relevantAspects = useMemo(
    () => [
      'OVERALL',
      ...relevantCompetencyIds
        .map((id) => {
          const competency = Object.values(COMPETENCIES).find(
            (c) => c.id === id,
          );
          return competency ? competency.abbrev : null;
        })
        .filter((abbrev): abbrev is TAspect => abbrev !== null),
    ],
    [relevantCompetencyIds],
  );

  const { fields, append, remove } = useFieldArray<TFormSchema>({
    control,
    name: 'settings.passingCriteria',
  });

  const aspects = useWatch({ control, name: 'settings.passingCriteria' });

  const addAspect = useCallback(() => {
    const usedAspects = new Set(aspects.map((a) => a.aspect));
    const unusedAspect = relevantAspects.find(
      (aspect) => !usedAspects.has(aspect as TAspect),
    );

    if (unusedAspect) {
      append({
        aspect: unusedAspect as TAspect,
        minPercentScore: 0,
      });
    }
  }, [append, aspects, relevantAspects]);

  if (isFormLoading || isSubcompetenciesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4 border rounded-md transition-colors flex flex-col space-y-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-row items-center space-x-2">
          <Label className="font-medium">Passing Criteria</Label>
          <SettingTooltip
            title="Passing Criteria"
            type="description"
            description="Define minimum passing scores for different aspects of this form."
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addAspect}
          className="flex items-center space-x-2"
          disabled={fields.length >= relevantAspects.length}
        >
          <PlusIcon size={12} />
          <span>New Rule</span>
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between w-full"
          >
            <div className="flex space-x-4 w-full">
              <Controller
                control={control}
                name={`settings.passingCriteria.${index}.aspect`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[12rem]">
                      <SelectValue placeholder="Select aspect" />
                    </SelectTrigger>
                    <SelectContent>
                      {relevantAspects.map((aspect) => {
                        const isUsed = aspects.some((a) => a.aspect === aspect);
                        return (
                          <SelectItem
                            key={aspect}
                            value={aspect}
                            disabled={isUsed && aspect !== field.value}
                          >
                            {aspect === 'OVERALL'
                              ? capitalizeFirstLetter(aspect)
                              : aspect}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="flex flex-row items-center space-x-2">
                <Controller
                  control={control}
                  name={`settings.passingCriteria.${index}.minPercentScore`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      className="w-[6rem] text-center font-mono text-lg"
                      placeholder="Min % Score"
                      min={0}
                      max={100}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <p className="text-xs text-neutral-500">
                  Minimum Passing Percent
                </p>
              </div>
            </div>
            <Button
              className="hover:opacity-100 opacity-50 hover:bg-transparent border rounded-md border-neutral-200 hover:border-neutral-500 transition-opacity"
              size="xs"
              variant="outline"
              onClick={() => remove(index)}
            >
              <MinusIcon size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
export {
  GeneralSettings,
  ResponseSettings,
  RoleWeightSettings,
  ScoreSettings,
  SelectSetting,
  SettingsContent,
  SettingsTabs,
  SettingTooltip,
  SwitchSetting,
  useWeights,
};
