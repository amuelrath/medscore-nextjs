'use client';

import { FormResult } from '@/actions/forms/get-form-by-id';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormMultiselect } from '@/features/forms-home/components/assessment-manager/form-multiselect';
import { ParticipantManager } from '@/features/forms-home/components/assessment-manager/participant-manager';
import { ZAssessmentSchema } from '@/features/forms-home/schemas/assessment-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizonalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DefaultValues,
  FieldPath,
  FormProvider,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

export type TAssessmentEditorFormSchema = z.infer<typeof ZAssessmentSchema>;

type AssessmentEditorDialogProps = {
  disabledFields?: FieldPath<TAssessmentEditorFormSchema>[];
  disabledSpecificPairFields?: {
    [index: number]: ('evaluatorId' | 'evaluateeIds')[];
  };
  submitFn: (data: TAssessmentEditorFormSchema) => void;
  defaultValues?: DefaultValues<TAssessmentEditorFormSchema>;
  forms: Pick<FormResult, 'id' | 'type'>[];
};

export function AssessmentCreatorDialog({
  disabledFields = [],
  disabledSpecificPairFields = {},
  submitFn,
  defaultValues,
  forms,
}: AssessmentEditorDialogProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Convert Date objects to strings in the required format
  const formattedDefaultValues = {
    ...defaultValues,
    startsAt: defaultValues?.startsAt
      ? new Date(defaultValues.startsAt)
          .toLocaleString('sv-SE', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
          .slice(0, 16)
      : defaultValues?.startsAt,
    expiresAt: defaultValues?.expiresAt
      ? new Date(defaultValues.expiresAt)
          .toLocaleString('sv-SE', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
          .slice(0, 16)
      : defaultValues?.expiresAt,
  };

  const methods = useForm<TAssessmentEditorFormSchema>({
    resolver: zodResolver(ZAssessmentSchema),
    defaultValues: formattedDefaultValues,
  });

  // Watch for changes in the formId field
  const selectedFormId = useWatch({
    control: methods.control,
    name: 'formId',
  });

  useEffect(() => {
    methods.resetField(`participants`);
  }, [methods, selectedFormId]);

  useEffect(() => {
    const selectedFormType = forms.find(
      (f) =>
        f.id ===
        ((Array.isArray(selectedFormId) && selectedFormId[0]) || undefined),
    )?.type;
    if (selectedFormType) return methods.setValue('formType', selectedFormType);
    return methods.setValue('formType', null);
  }, [forms, methods, selectedFormId]);

  const onSubmit = (data: TAssessmentEditorFormSchema) => {
    submitFn(data);
    methods.reset();
    methods.resetField('startsAt');
    methods.resetField('expiresAt');
    setDialogOpen(false);
  };

  const isFieldDisabled = (name: FieldPath<TAssessmentEditorFormSchema>) =>
    disabledFields.includes(name);

  return (
    <Dialog onOpenChange={(open) => setDialogOpen(open)} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="xs"
          variant="accent-secondary-background"
          className="font-semibold text-teal-950 w-[200px] space-x-2"
        >
          <SendHorizonalIcon size={14} strokeWidth={2.5} />
          <p>Request Assessment</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        noCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex h-[600px] max-w-[800px] flex-col"
      >
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <SendHorizonalIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>New Assessment</p>
          </DialogTitle>
        </div>
        <hr />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex-grow flex flex-col justify-between"
          >
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="col-span-1 flex flex-col mr-6 bg-primary/5 rounded-sm justify-center items-center">
                <FormMultiselect
                  control={methods.control}
                  disabled={isFieldDisabled('formId')}
                  name="formId"
                />
                <input
                  type="hidden"
                  onChange={methods.register('formType').onChange}
                  name={methods.register('formType').name}
                  ref={methods.register('formType').ref}
                />
              </div>
              <div className="col-span-1 flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="startsAt">
                    Begin to allow responses at
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    disabled={isFieldDisabled('startsAt')}
                    name={methods.register('startsAt').name}
                    onChange={methods.register('startsAt').onChange}
                    defaultValue={defaultValues?.startsAt}
                    ref={methods.register('startsAt').ref}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="startsAt">
                    Responses should be submitted by
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    disabled={isFieldDisabled('expiresAt')}
                    name={methods.register('expiresAt').name}
                    defaultValue={defaultValues?.expiresAt}
                    onChange={methods.register('expiresAt').onChange}
                    ref={methods.register('expiresAt').ref}
                  />
                </div>
              </div>
              <div className="space-y-2 col-span-2 flex flex-col">
                <Label
                  className="text-neutral-500  text-2xs font-normal"
                  htmlFor="title"
                >
                  Assessment Title
                </Label>
                <Input
                  size="sm"
                  placeholder="Untitled Assessment"
                  disabled={isFieldDisabled('title')}
                  name={methods.register('title').name}
                  onChange={methods.register('title').onChange}
                  ref={methods.register('title').ref}
                />
              </div>
              <div className="flex flex-grow col-span-2 h-[13rem]">
                <ParticipantManager
                  type="CREATE"
                  disabled={
                    isFieldDisabled('participants') || !selectedFormId[0]
                  }
                  disabledSpecificPairFields={disabledSpecificPairFields}
                />
              </div>
              <div className="flex flex-col space-y-4 text-xs col-span-1 row-start-1 col-start-3 row-span-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-normal">Allow Multiple Submissions</Label>
                  <Switch size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-normal">Allow Save & Quit</Label>
                  <Switch size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-normal">Allow Revisions</Label>
                  <Switch size="sm" />
                </div>
              <hr/>
              </div>
            </div>
            <hr />
            <div className="flex select-none  flex-row justify-end items-baseline space-x-2">
              <Button disabled={methods.formState.isSubmitting} type="submit">
                Send
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
