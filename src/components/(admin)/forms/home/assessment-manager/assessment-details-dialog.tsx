import {
  TAssessmentEditorFormSchema,
  ZRequestResponseFormSchema,
} from '@/components/(admin)/forms/home/assessment-manager/assessment-creator-dialog';
import { ParticipantManager } from '@/components/(admin)/forms/home/assessment-manager/participant-manager';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CountdownTimer } from '@/components/ui/countdown';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TResponseStatus } from '@/db/schema';
import {
  AssessmentsWithRequestsResult,
  getAssessmentsWithRequests,
} from '@/server/actions/assessments/get-assessments-with-requests';
import { updateAssessment } from '@/server/actions/assessments/update-assessment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { ArrowUpRightFromSquare, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pie, PieChart } from 'recharts';

const chartConfig = {
  COMPLETED: {
    label: 'Completed',
  },
  STARTED: {
    label: 'Started',
  },
  NOT_STARTED: {
    label: 'Not Started',
  },
} satisfies ChartConfig;

type AssessmentStatusPieChartData = {
  status: TResponseStatus;
  count: number;
}[];

function AssessmentStatusPieChart({
  data,
}: {
  data: AssessmentStatusPieChartData;
}) {
  return (
    <ChartContainer className="w-1/2 h-full" config={chartConfig}>
      <PieChart
        margin={{
          bottom: 0,
          top: 0,
        }}
        className=""
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          animationDuration={0}
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={16}
        />
      </PieChart>
    </ChartContainer>
  );
}

function getFill(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'hsl(var(--primary))';
    case 'STARTED':
      return 'hsl(var(--primary) / 0.8)';
    case 'NOT_STARTED':
      return 'hsl(var(--primary) / 0.5)';
    default:
      throw new Error('status not valid');
  }
}

function transformStatusData(
  responses: AssessmentsWithRequestsResult[0]['responses'],
): AssessmentStatusPieChartData {
  const statusCounts = responses.reduce(
    (acc, response) => {
      acc[response.status] = (acc[response.status] || 0) + 1;
      return acc;
    },
    {} as Record<TResponseStatus, number>,
  );

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as TResponseStatus,
    fill: getFill(status),
    count,
  }));
}

function transformToDefaultValues(
  assessment: AssessmentsWithRequestsResult[number],
): TAssessmentEditorFormSchema {
  return {
    formId: [assessment.formId],
    title: assessment.title,
    participants: assessment.responses.map((r) => ({
      evaluateeIds: r.evaluatee?.id ? [r.evaluatee.id] : [],
      evaluatorId: r.respondee?.id ? [r.respondee.id] : [],
      status: r.status,
    })),
    expiresAt: new Date(assessment.expiresAt)
      .toLocaleString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .slice(0, 16),
    startsAt: new Date(assessment.startsAt)
      .toLocaleString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .slice(0, 16),
    formType: assessment.form.type,
  };
}

interface AssessmentDetailsDialogProps {
  assessmentId: string;
}

export function AssessmentDetailsDialog({
  assessmentId,
}: AssessmentDetailsDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => getAssessmentsWithRequests(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const assessment = assessments?.find((a) => a.id === assessmentId);

  const defaultValues = assessment
    ? transformToDefaultValues(assessment)
    : undefined;

  const methods = useForm<TAssessmentEditorFormSchema>({
    defaultValues,
    resolver: zodResolver(ZRequestResponseFormSchema),
  });

  const queryClient = useQueryClient();
  const { mutate: mutateUpdateAssessment, isPending } = useMutation({
    mutationFn: updateAssessment,
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      setOpen(false);
    },
  });

  function handleSubmit(data: TAssessmentEditorFormSchema) {
    mutateUpdateAssessment({ ...data, assessmentId });
  }

  const formValues = methods.watch();
  const hasChanges = !isEqual(formValues, defaultValues);

  if (isLoading) return <div>Loading!</div>;
  if (!assessment) return null;

  return (
    <Dialog onOpenChange={(state) => setOpen(state)} open={open}>
      <DialogTrigger asChild>
        <ArrowUpRightFromSquare size={16} className="opacity-50" />
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>{assessment.title}</DialogTitle>
              <DialogDescription className="flex flex-col space-y-1">
                <p className="flex flex-row items-center space-x-2">
                  <span>
                    <ClipboardList className="text-neutral-400" size={14} />
                  </span>
                  <span>{assessment.form.title}</span>
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 mt-4 gap-4 gap-y-2">
              <div className="col-span-1 relative flex flex-col row-span-2">
                <div className="flex-row items-start flex">
                  <div className="flex justify-center flex-col flex-grow">
                    <ul className=" text-xs space-y-4">
                      <li className="flex flex-row space-x-2 items-center">
                        <span className="size-3 rounded-full bg-primary" />
                        <span>Completed</span>
                      </li>
                      <li className="flex flex-row space-x-2 items-center">
                        <span className="size-3 rounded-full bg-primary/80" />
                        <span>Started</span>
                      </li>
                      <li className="flex flex-row space-x-2 items-center">
                        <span className="size-3 rounded-full bg-primary/50" />
                        <span>Not Started</span>
                      </li>
                    </ul>
                  </div>
                  <AssessmentStatusPieChart
                    data={transformStatusData(assessment.responses)}
                  />
                </div>
                <Separator className="mt-3" />
                <div className="flex flex-col justify-center pt-3 items-center text-xs space-x-2">
                  <p className="flex flex-row space-x-1">
                    <span>Assessment expires in</span>
                    <strong>
                      <CountdownTimer
                        targetDate={assessment.expiresAt}
                        showSeconds={false}
                      />
                    </strong>
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="startsAt">
                    Begin to allow responses at
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    id="startsAt"
                    onChange={methods.register('startsAt').onChange}
                    ref={methods.register('startsAt').ref}
                    name={methods.register('startsAt').name}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="expiresAt">
                    Responses should be submitted by
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    id="expiresAt"
                    onChange={methods.register('expiresAt').onChange}
                    ref={methods.register('expiresAt').ref}
                    name={methods.register('expiresAt').name}
                  />
                </div>
              </div>
              <div className="col-span-2 h-64 mt-4 flex flex-grow">
                <ParticipantManager assessmentId={assessmentId} type="EDIT" />
              </div>
            </div>
            <div className="flex mt-4 text-xs flex-row items-center space-x-2 justify-end">
              <Button
                size="sm"
                className="w-32 transition"
                disabled={
                  methods.formState.isSubmitting || isPending || !hasChanges
                }
                type="submit"
              >
                {(() => {
                  if (hasChanges && !isPending) {
                    return 'Save Changes';
                  }
                  if (!hasChanges) {
                    return 'Changes Saved';
                  }
                  if (isPending && hasChanges) {
                    return 'Saving...';
                  }
                  return '';
                })()}
              </Button>
              <DialogClose asChild>
                <Button
                  size="sm"
                  onClick={() => methods.reset()}
                  type="button"
                  variant="outline"
                >
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
