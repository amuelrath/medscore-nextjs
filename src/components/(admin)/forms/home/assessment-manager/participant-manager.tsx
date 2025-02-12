import { TAssessmentEditorFormSchema } from '@/components/(admin)/forms/home/assessment-manager/assessment-creator-dialog';
import { Badge } from '@/components/ui/badge';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserSelect } from '@/components/ui/user-select';
import { ZPairSchema } from '@/lib/helpers/zod/participation-schema';
import { deleteResponseByAssessmentEvaluatorEvaluatee } from '@/server/actions/responses/delete-response-by-assessment-evaluator-evaluatee';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PlusCircleIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

type ParticipantManagerBaseProps = {
  disabled?: boolean;
  disabledSpecificPairFields?: {
    [index: number]: ('evaluatorId' | 'evaluateeIds')[];
  };
};

type ParticipantManagerEditProps = ParticipantManagerBaseProps & {
  type: 'EDIT';
  assessmentId: string;
};

type ParticipantManagerCreateProps = ParticipantManagerBaseProps & {
  type: 'CREATE';
};

type ParticipantManagerProps =
  | ParticipantManagerEditProps
  | ParticipantManagerCreateProps;

type ParticipantInputProps = {
  index: number;
  onRemove: () => void;
  disabled: boolean;
  type: 'EDIT' | 'CREATE';
  disabledFields: ('evaluatorId' | 'evaluateeIds')[];
  usedEvaluatorIds: string[];
};

function ParticipantInput({
  index,
  onRemove,
  disabled,
  type,
  disabledFields,
  usedEvaluatorIds,
}: ParticipantInputProps) {
  const { control } = useFormContext<TAssessmentEditorFormSchema>();

  const participant = useWatch({
    control,
    name: `participants.${index}`,
  });

  const selectedFormId = useWatch({
    control,
    name: 'formId',
  });

  const disabledEvaluatorIds = [
    ...(participant?.evaluateeIds || []),
    ...usedEvaluatorIds.filter((id) => id !== participant?.evaluatorId?.[0]),
  ];

  return (
    <div className="grid grid-cols-7 w-full">
      <div className="col-span-2 content-center">
        <UserSelect
          control={control}
          disabled={
            disabled ||
            disabledFields.includes('evaluatorId') ||
            participant?.status !== 'NOT_STARTED'
          }
          formId={selectedFormId?.[0]}
          max={1}
          name={`participants.${index}.evaluatorId`}
          disabledIds={disabledEvaluatorIds}
        />
      </div>
      <div className="col-span-2 content-center">
        <UserSelect
          control={control}
          max={type === 'CREATE' ? 999 : 1}
          disabled={
            disabled ||
            disabledFields.includes('evaluateeIds') ||
            participant?.status !== 'NOT_STARTED'
          }
          formId={selectedFormId?.[0]}
          name={`participants.${index}.evaluateeIds`}
          disabledIds={participant?.evaluatorId || []}
        />
      </div>
      <div className="col-span-2">
        {type === 'EDIT' && (
          <Badge
            size="xs"
            className={`bg-${getStatusColor(participant?.status)}`}
          >
            {getStatusLabel(participant?.status)}
          </Badge>
        )}
      </div>
      <div className="justify-end flex items-center col-span-1">
        {type === 'EDIT' && participant?.status !== 'NOT_STARTED' ? (
          <ConfirmDialog
            confirmText="Remove"
            buttonVariant="destructive"
            onConfirm={onRemove}
            title="Remove Request"
            description="This will result in irreversible data loss."
          >
            <XIcon
              size={16}
              className={`opacity-50 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-destructive hover:opacity-100'} transition-all`}
            />
          </ConfirmDialog>
        ) : (
          <XIcon
            size={16}
            className={`opacity-50 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-destructive hover:opacity-100'} transition-all`}
            onClick={onRemove}
          />
        )}
      </div>
    </div>
  );
}

export function ParticipantManager(props: ParticipantManagerProps) {
  const { type, disabled = false, disabledSpecificPairFields = {} } = props;
  const { control } = useFormContext<TAssessmentEditorFormSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  const queryClient = useQueryClient();
  const { mutate: mutateDeleteResponse } = useMutation({
    mutationFn: deleteResponseByAssessmentEvaluatorEvaluatee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });

  const participants =
    useWatch({
      control,
      name: 'participants',
    }) || [];

  const usedEvaluatorIds = React.useMemo(
    () =>
      type === 'CREATE'
        ? participants.map((pair) => pair.evaluatorId?.[0]).filter(Boolean)
        : [],
    [participants, type],
  );

  const handleAddParticipant = () => {
    if (!disabled) {
      const newParticipant = ZPairSchema.parse({
        evaluateeIds: [],
        evaluatorId: [],
        status: 'NOT_STARTED',
      });
      append(newParticipant);
    }
  };

  const handleRemoveParticipant = (index: number) => {
    if (type === 'EDIT') {
      const { evaluatorId, evaluateeIds } = fields[index];
      mutateDeleteResponse({
        evaluatorId: evaluatorId[0],
        evaluateeId: evaluateeIds[0],
        // eslint-disable-next-line react/destructuring-assignment
        assessmentId: props.assessmentId,
      });
    }
    remove(index);
  };

  return (
    <div className="flex flex-col flex-grow w-full relative select-none border-b">
      <div className="grid max-h-6 text-sm border-b pb-1 sticky -top-[0.02px] bg-white flex-grow z-20 text-neutral-500 grid-cols-7">
        <div className="col-span-2">
          <Label variant="light">Evaluator</Label>
        </div>
        <div className="col-span-2">
          <Label variant="light">
            {type === 'CREATE' ? 'Evaluatee(s)' : 'Evaluatee'}
          </Label>
        </div>
        <div className="col-span-2">
          {type === 'EDIT' && <Label variant="light">Status</Label>}
        </div>
        <div className="col-span-1 flex flex-row justify-end">
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 0.98 }}>
            <PlusCircleIcon
              size={16}
              className={`text-foreground/50 hover:text-foreground/30 transition ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={handleAddParticipant}
            />
          </motion.div>
        </div>
      </div>
      <div className="flex-grow pt-2 space-y-2 -mr-[0.9rem] overflow-y-scroll">
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <ParticipantInput
              disabled={disabled}
              disabledFields={disabledSpecificPairFields[index] || []}
              index={index}
              type={type}
              onRemove={() => handleRemoveParticipant(index)}
              usedEvaluatorIds={usedEvaluatorIds}
            />
            <Separator className="h-[0.5px] opacity-50" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status?: string) {
  switch (status) {
    case 'NOT_STARTED':
      return 'primary/50';
    case 'STARTED':
      return 'primary/80';
    case 'COMPLETED':
      return 'primary';
    default:
      return 'neutral-400';
  }
}

function getStatusLabel(status?: string) {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not Started';
    case 'STARTED':
      return 'Started';
    case 'COMPLETED':
      return 'Completed';
    default:
      return 'Issue';
  }
}
