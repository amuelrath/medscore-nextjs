import { ParticipantManager } from '@/components/(admin)/forms/home/assessment-manager/participant-manager';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormMultiselect } from '@/components/ui/form-multiselect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ZParticipantsSchema } from '@/lib/helpers/zod/participation-schema';
import { FormResult } from '@/server/actions/forms/get-all-forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizonalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DefaultValues,
  FieldPath,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

export const ZRequestResponseFormSchema = z
  .object({
    formId: z.array(z.string().uuid()).max(1),
    title: z.string().optional(),
    formType: z.enum(['OSCE', 'EVALUATION', 'DIRECT_OBSERVATION']).nullable(),
    startsAt: z.string(),
    expiresAt: z.string(),
    participants: ZParticipantsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.formType === ('OSCE' || 'EVALUATION')) {
        return (data.participants?.length || 0) > 0;
      }
      return true;
    },
    {
      message:
        'EVALUATION or OSCE form type must have specific pair participants',
      path: ['specificPairParticipants'],
    },
  );

export type TAssessmentEditorFormSchema = z.infer<
  typeof ZRequestResponseFormSchema
>;

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
    resolver: zodResolver(ZRequestResponseFormSchema),
    defaultValues: formattedDefaultValues,
  });

  // Watch for changes in the formId field
  const selectedFormId = methods.watch('formId');

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

  const renderParticipantsInput = () => {
    if (!selectedFormId || selectedFormId.length === 0) {
      return null;
    }

    const selectedForm = forms.find(
      (f) =>
        f.id === (Array.isArray(selectedFormId) && selectedFormId[0]) ||
        undefined,
    );

    if (!selectedForm) {
      return <div>Selected form not found</div>;
    }

    return (
      <ParticipantManager
        type="CREATE"
        disabled={isFieldDisabled('participants')}
        disabledSpecificPairFields={disabledSpecificPairFields}
      />
    );
  };

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
        className="flex h-[550px] max-w-[500px] flex-col"
      >
        <DialogHeader>
          <DialogTitle className="pointer-events-none flex items-center space-x-2">
            <SendHorizonalIcon size={14} />
            <p>New Assessment</p>
          </DialogTitle>
        </DialogHeader>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex-grow flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 w-full">
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
            </div>
            <div className="space-y-2 flex flex-col">
              <Label
                className="text-neutral-500 text-2xs font-normal"
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
            <div className="flex h-52">{renderParticipantsInput()}</div>
            <hr />
            <div className="flex select-none flex-row justify-end items-baseline space-x-2">
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
