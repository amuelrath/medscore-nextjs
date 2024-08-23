import { useAssessmentRequestActions } from '@/components/(admin)/forms/home/assessment-request-popover/hooks';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputDialog } from '@/components/ui/input-dialog';
import { cn } from '@/lib/helpers/utils';
import { getAssessmentsWithRequests } from '@/server/actions/assessments/get-assessments-with-requests';
import { zodResolver } from '@hookform/resolvers/zod';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CircleSlashIcon, EditIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function AssessmentRequestDropdown({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const {
    mutateDeleteAssessment,
    mutateCancelAssessment,
    mutateRenameAssessment,
  } = useAssessmentRequestActions({ assessmentId });

  const { data: assessments } = useSuspenseQuery({
    queryKey: ['assessments'],
    queryFn: () => getAssessmentsWithRequests(),
  });

  const assessment = assessments?.find((a) => a.id === assessmentId);

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'text-center mb-3 bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center',
          )}
          size="xs"
        >
          <DotsHorizontalIcon className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-28 p-1 text-xs flex flex-col space-y-1">
        <DropdownItemRenameAssessmentForm
          assessmentId={assessmentId}
          currentTitle={assessment?.title || ''}
          mutateRenameAssessment={mutateRenameAssessment}
        />
        <ConfirmDialog
          confirmText="Stop"
          buttonVariant="destructive"
          onConfirm={() => mutateCancelAssessment()}
          title="Cancel Assessment"
          description="Stop allowing responses to be submitted for this assessment."
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="flex items-center justify-between flex-row"
          >
            <span>Cancel</span>
            <CircleSlashIcon size={16} className="opacity-50" />
          </DropdownMenuItem>
        </ConfirmDialog>
        <ConfirmDialog
          confirmText="Delete"
          buttonVariant="destructive"
          onConfirm={() => mutateDeleteAssessment()}
          title="Delete Assessment"
          description="Proceeding will permanently delete all responses to this assessment. This action is irreversible."
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="flex items-center justify-between flex-row"
          >
            <span>Delete</span>
            <TrashIcon size={16} className="opacity-50" />
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ZRenameAssessmentFormSchema = z.object({
  assessmentId: z.string().uuid(),
  title: z
    .string()
    .min(1, { message: 'Fill out the missing fields.' }),
});

type TRenameAssessmentForm = z.infer<typeof ZRenameAssessmentFormSchema>;

function DropdownItemRenameAssessmentForm({
  assessmentId,
  currentTitle,
  mutateRenameAssessment,
}: {
  assessmentId: string;
  currentTitle: string;
  mutateRenameAssessment: (data: TRenameAssessmentForm) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<TRenameAssessmentForm>({
    resolver: zodResolver(ZRenameAssessmentFormSchema),
    defaultValues: {
      assessmentId,
      title: currentTitle,
    },
  });

  const onSubmit = (data: TRenameAssessmentForm) => {
    mutateRenameAssessment(data);
    form.setValue("title", data.title);
    setOpen(false); // Close the dialog after successful submission
  };

  return (
    <InputDialog<TRenameAssessmentForm>
      title="Rename Assessment"
      form={form}
      name="title"
      label="New Title"
      submitLabel="Rename"
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    >
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="flex items-center justify-between flex-row"
      >
        <span>Rename</span>
        <EditIcon size={16} className="opacity-50" />
      </DropdownMenuItem>
    </InputDialog>
  );
}
