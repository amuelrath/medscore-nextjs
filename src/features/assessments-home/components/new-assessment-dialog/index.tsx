'use client';

import { Button } from '@/components/ui/button';
import {
  CardRadioGroup,
  CardRadioGroupItem,
  CardRadioItemDescription,
  CardRadioItemIcon,
  CardRadioItemLabel,
} from '@/components/ui/card-radio-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TAssessmentDetailsStepSchema,
  ZAssessmentDetailsStepSchema,
} from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import {
  MultistepFormProvider,
  useMultistepFormContext,
} from '@/hooks/use-multistep-form-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { addHours, addMinutes, format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { BookDashedIcon, BoxesIcon, SendHorizonalIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

function AssessmentDetailsStep() {
  const details = useAssessmentWizardStore((s) => s.details);
  const setDetails = useAssessmentWizardStore((s) => s.setDetails);

  const now = useMemo(() => Date.now(), []);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAssessmentDetailsStepSchema>({
    defaultValues: {
      title: details.title || 'Untitled Assessment',
      startsAt:
        details.startsAt || format(addMinutes(now, -2), "yyyy-MM-dd'T'HH:mm"),
      expiresAt:
        details.expiresAt || format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm"),
    },
    resolver: zodResolver(ZAssessmentDetailsStepSchema),
  });

  const submit = (data: TAssessmentDetailsStepSchema) => {
    setDetails(data);
    router.push(`/assessments/create`);
  };

  return (
    <form
      id="current-step"
      onSubmit={handleSubmit(submit)}
      className="flex-grow flex-col space-y-2 items-start"
    >
      <div>
        <Label className="flex flex-row justify-between">Title</Label>
        <Input
          {...register('title')}
          size="sm"
          placeholder="Untitled Assessment"
        />
      </div>
      <div>
        <Label className="flex flex-row justify-between">
          Start accepting responses at
          <span className="text-destructive justify-end" />
        </Label>
        <Input {...register('startsAt')} size="sm" type="datetime-local" />
      </div>
      <div>
        <Label className="flex flex-row justify-between">Stop accepting responses at</Label>
        <Input {...register('expiresAt')} size="sm" type="datetime-local" />
      </div>
    </form>
  );
}

const ZAssessmentTypeStepSchema = z.object({
  type: z.union([
    z.literal('TEMPLATE'), // create an assessment from a template, then we go to wizard to confirm step
    z.literal('NEW'), // takes us to wizard directly
  ]),
});
type TAssessmentTypeStepSchema = z.infer<typeof ZAssessmentTypeStepSchema>;

function AssessmentTypeStep() {
  const { next } = useMultistepFormContext();
  const reset = useAssessmentWizardStore((s) => s.reset)

  // we want to reset the store on first render
  useEffect(() => {
    reset()
  }, [reset]);

  const { control, handleSubmit } = useForm<TAssessmentTypeStepSchema>({
    resolver: zodResolver(ZAssessmentTypeStepSchema),
  });

  const submit = (data: TAssessmentTypeStepSchema) => {
    console.log(data);
    // TODO ensure we RESET useAssessmentWizardStore and set the selected type
    next();
  };
  return (
    <form
      id="current-step"
      onSubmit={handleSubmit(submit)}
      className="space-y-4"
    >
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <CardRadioGroup
            orientation="vertical"
            value={field.value}
            onValueChange={field.onChange}
          >
            <CardRadioGroupItem value="NEW">
              <CardRadioItemDescription>
                Create a new assessment from scratch.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BoxesIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>New</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="TEMPLATE">
              <CardRadioItemDescription>
                Use saved templates from previous assessments to speed up
                creation.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BookDashedIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>From Template</CardRadioItemLabel>
            </CardRadioGroupItem>
          </CardRadioGroup>
        )}
      />
    </form>
  );
}

const stepDescriptions = [
  'Select the type of assessment you would like to create.',
  'Give your assessment a title and duration.',
];

function NewAssessmentDialog() {
  const { step, currentStepIndex, isLastStep } = useMultistepFormContext();

  return (
    <>
      <DialogTitle className="pointer-events-none flex items-center space-x-2">
        <span className="p-1.5 rounded-full bg-primary/10">
          <SendHorizonalIcon size={16} className="text-foreground" />
        </span>
      </DialogTitle>
      <div className="space-y-1">
        <DialogTitle>
          <p>New Assessment</p>
        </DialogTitle>
        <DialogDescription>
          {stepDescriptions[currentStepIndex]}
        </DialogDescription>
      </div>
      <hr />
      <div className="h-[160px] flex flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.15, easings: ['eastOut'] }}
          >
            {step}
          </motion.div>
        </AnimatePresence>
      </div>
      <hr className="w-full" />
      <div className="flex w-full flex-row items-center justify-end space-x-2">
        <Button type="submit" form="current-step">
          {isLastStep ? 'Confirm' : 'Next'}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </div>
    </>
  );
}

const stepComponents = [<AssessmentTypeStep />, <AssessmentDetailsStep />];

export function NewAssessmentDialogTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs" variant="accent-secondary" className="flex space-x-2">
          <SendHorizonalIcon size={16} />
          <span>New Assessment</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <MultistepFormProvider steps={stepComponents}>
          <NewAssessmentDialog />
        </MultistepFormProvider>
      </DialogContent>
    </Dialog>
  );
}
