import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserSelect } from '@/components/ui/user-select';
import { TRequestSchema, TParticipantsSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { ZPairSchema } from '@/features/forms-home/schemas/assessment-schemas';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { UsersIcon, XIcon } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

function ParticipantRow({
  index,
  handleRemove,
}: {
  index: number;
  handleRemove: () => void;
}) {
  const { control } = useFormContext<TRequestSchema>();

  const participant = useWatch({
    control,
    name: `participants.${index}`,
  });

  const selectedFormId = useWatch({
    control,
    name: 'formId',
  });

  const participants = useWatch({
    control,
    name: 'participants',
  });

  const usedEvaluatorIds = participants?.map((p) => p.evaluatorId[0]) || [];

  const disabledEvaluatorIds = [
    ...(participant?.evaluateeIds || []),
    ...usedEvaluatorIds.filter((id) => id !== participant?.evaluatorId?.[0]),
  ];
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 border-b p-2 select-none"
    >
      <div>
        <UserSelect
          key={`evaluatees-${selectedFormId}`}
          control={control}
          formId={selectedFormId}
          max={1}
          name={`participants.${index}.evaluatorId`}
          disabledIds={disabledEvaluatorIds}
        />
      </div>
      <div>
        <UserSelect
          key={`evaluatees-${selectedFormId}`}
          control={control}
          formId={selectedFormId}
          name={`participants.${index}.evaluateeIds`}
          disabledIds={
            participant?.evaluatorId?.[0] ? [participant.evaluatorId[0]] : []
          }
        />
      </div>
      <div className="justify-end flex flex-row items-center">
        <XIcon
          onClick={handleRemove}
          size={20}
          className="opacity-50 transition hover:cursor-pointer hover:text-destructive"
        />
      </div>
    </motion.div>
  );
}

function AssessmentParticipantsSection() {
  const {
    formState: { errors },
    ...methods
  } = useFormContext<TParticipantsSchema>();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'requests',
  });

  const handleAddParticipant = () => {
    const newParticipant = ZPairSchema.parse({
      evaluateeIds: [],
      evaluatorId: [],
      status: 'NOT_STARTED',
    });
    append(newParticipant);
  };

  const handleRemoveRow = (idx: number) => {
    remove(idx);
  };
  return (
    <div className="flex-grow space-y-1">
      <div className="flex text-md font-medium flex-row items-center justify-between">
        <span className="flex flex-row items-center space-x-2">
          <UsersIcon className="text-primary" size={16} />
          <p>Participants</p>
        </span>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleAddParticipant();
          }}
          variant="outline"
          size="xs"
        >
          Add Row
        </Button>
      </div>
      <hr />
      <div className="grid grid-cols-3 text-xs bg-primary/5 rounded p-2 select-none">
        <Label className="text-xs text-neutral-500">Evaluator</Label>
        <Label className="text-xs text-neutral-500">Evaluatees</Label>
        <Label className="text-xs text-neutral-500 justify-self-end">
          Actions
        </Label>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {fields.map((f, index) => (
            <ParticipantRow
              key={f.id}
              index={index}
              handleRemove={() => handleRemoveRow(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
