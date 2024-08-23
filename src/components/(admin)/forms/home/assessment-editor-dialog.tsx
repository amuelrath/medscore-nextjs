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
import { UserSelect } from '@/components/ui/user-select';
import { ZParticipantsSchema } from '@/lib/zod/participation-schema';
import { FormResult } from '@/server/actions/forms/get-all-forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon, SendHorizonalIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DefaultValues,
  FieldPath,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

const ZRequestResponseFormSchema = z
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

export function AssessmentEditorDialog({
  disabledFields = [],
  disabledSpecificPairFields = {},
  submitFn,
  defaultValues,
  forms,
}: AssessmentEditorDialogProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const methods = useForm<TAssessmentEditorFormSchema>({
    resolver: zodResolver(ZRequestResponseFormSchema),
    defaultValues,
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

    switch (selectedForm.type) {
      case 'OSCE':
      case 'EVALUATION':
        return (
          <ParticipantManager
            disabled={isFieldDisabled('participants')}
            disabledSpecificPairFields={disabledSpecificPairFields}
          />
        );
      default:
        return <div>Unsupported form type</div>;
    }
  };

  return (
    <Dialog onOpenChange={(open) => setDialogOpen(open)} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="accent-secondary" className="font-semibold text-teal-950 space-x-2">
          <SendHorizonalIcon size={14} strokeWidth={2.5} />
          <p>Request Assessment</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        noCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex h-[525px] max-w-[500px] flex-col"
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
            <div className="flex-grow">{renderParticipantsInput()}</div>

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

function ParticipantManager({
  disabled = false,
  disabledSpecificPairFields = {},
}: {
  disabled?: boolean;
  disabledSpecificPairFields?: {
    [index: number]: ('evaluatorId' | 'evaluateeIds')[];
  };
}) {
  const { control } = useFormContext<TAssessmentEditorFormSchema>();
  const { fields, append, remove } = useFieldArray<TAssessmentEditorFormSchema>(
    {
      control,
      name: 'participants',
    },
  );

  const participants = useWatch({
    control,
    name: `participants`,
  });

  if (fields.length === 0) {
    append({
      evaluateeIds: [],
      evaluatorId: [],
    });
  }

  const usedEvaluatorIds =
    participants?.map((pair) => pair.evaluatorId[0]).filter(Boolean) || [];

  return (
    <div className="flex flex-col w-full select-none border-b h-44">
      <div className="grid text-sm border-b pb-1 sticky -top-[0.02px] bg-white flex-grow z-20 text-neutral-500 grid-cols-4">
        <div className="col-span-1">
          <Label variant="light">Evaluator</Label>
        </div>
        <div className="col-span-2">
          <Label variant="light">Evaluatee(s)</Label>
        </div>
        <div className="col-span-1 flex flex-row justify-end">
          <span
            onSelect={() =>
              !disabled && append({ evaluateeIds: [], evaluatorId: [] })
            }
          >
            <PlusCircleIcon
              size={16}
              className={`text-foreground/50 hover:text-foreground/30 transition ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            />
          </span>
        </div>
      </div>
      <div className="h-40 pt-4 -mr-[0.9rem] pl-1 overflow-y-scroll">
        {fields.map((f, index) => (
          <ParticipantInput
            key={f.id}
            disabled={disabled}
            disabledFields={disabledSpecificPairFields[index] || []}
            index={index}
            remove={() => remove(index)}
            usedEvaluatorIds={usedEvaluatorIds}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantInput({
  index,
  remove,
  usedEvaluatorIds,
  disabled = false,
  disabledFields = [],
}: {
  index: number;
  disabled: boolean;
  disabledFields: ('evaluatorId' | 'evaluateeIds')[];
  remove: () => void;
  usedEvaluatorIds: string[];
}) {
  const { control, getValues } = useFormContext<TAssessmentEditorFormSchema>();
  const selectedFormId = getValues(`formId`);

  const evaluateeIds =
    useWatch({
      control,
      name: `participants.${index}.evaluateeIds`,
    }) || []; // Ensure it's always an array

  const evaluatorId =
    useWatch({
      control,
      name: `participants.${index}.evaluatorId`,
    }) || []; // Ensure it's always an array

  const disabledEvaluatorIds = [
    ...evaluateeIds,
    ...usedEvaluatorIds.filter((id) => id !== evaluatorId[0]),
  ];

  return (
    <div className="grid grid-cols-4 mb-6 w-full">
      <div className="col-span-1 content-center">
        <UserSelect
          control={control}
          disabled={disabled || disabledFields.includes('evaluatorId')}
          formId={selectedFormId[0]}
          max={1}
          name={`participants.${index}.evaluatorId`}
          disabledIds={disabledEvaluatorIds}
        />
      </div>
      <div className="col-span-2 content-center">
        <UserSelect
          control={control}
          disabled={disabled || disabledFields.includes('evaluateeIds')}
          formId={selectedFormId[0]}
          name={`participants.${index}.evaluateeIds`}
          disabledIds={evaluatorId}
        />
      </div>
      <div className="justify-end flex items-center col-span-1">
        <XIcon
          size={16}
          className={`opacity-50 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-destructive hover:opacity-100'} transition-all`}
          onClick={() => !disabled && remove()}
        />
      </div>
    </div>
  );
}
