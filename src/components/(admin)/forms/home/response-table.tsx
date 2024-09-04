import { AssessmentDetailsDialog } from '@/components/(admin)/forms/home/assessment-manager/assessment-details-dialog';
import { AssessmentRequestDropdown } from '@/components/(admin)/forms/home/assessment-request-popover';
import { Avatar, AvatarStack } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CountdownTimer } from '@/components/ui/countdown';
import { TFormType } from '@/db/schema';
import { getInitials } from '@/lib/get-initials';
import { getFullName } from '@/lib/helpers/getFullName';
import { cn } from '@/lib/helpers/utils';
import { truncate } from '@/lib/truncate';
import { AssessmentsWithRequestsResult } from '@/server/actions/assessments/get-assessments-with-requests';
import { updateResponseStatus } from '@/server/actions/responses/update-status';
import { useMutation } from '@tanstack/react-query';
import { ArrowRightIcon, ClipboardListIcon, ClockIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ResponseProps {
  responseId: string;
  formTitle: string;
  formType: TFormType;
  responseCreatedAt: Date;
  status: 'COMPLETED' | 'STARTED' | 'NOT_STARTED';
  evaluateeName: string | undefined;
  assessmentExpiresAt: Date;
}

export function ResponseTable({ children }: { children: ReactNode }) {
  return (
    <Card className="opacity-80 h-full flex-grow col-span-2 mt-[1px] relative flex flex-col">
      {children}
    </Card>
  );
}

export function ResponseTableHeader({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-row w-full min-h-12 max-h-12 items-center px-2 overflow-hidden">
      {children}
    </span>
  );
}

export function ResponseTableNotification({ requests }: { requests: number }) {
  return (
    <span
      className={cn(
        'px-1 py-0.5 aspect-square align-middle text-center leading-none rounded-full bg-destructive font-mono text-2xs text-white',
        !(requests > 0) && 'opacity-0',
      )}
    >
      <p>{requests}</p>
    </span>
  );
}

export function ResponseTableContent({ children }: { children: ReactNode }) {
  return (
    <ul className="flex-grow flex-col flex relative overflow-y-scroll mb-[6px] space-y-4 px-2 py-2">
      {children}
    </ul>
  );
}

export function ResponseTableRow({ ...response }: ResponseProps) {
  const router = useRouter();

  const { mutate: mutateUpdateStatus } = useMutation({
    mutationFn: updateResponseStatus,
  });

  const handleClick = () => {
    if (response.status === 'NOT_STARTED') {
      mutateUpdateStatus({
        responseId: response.responseId,
        status: 'STARTED',
      });
    }

    if (response.status === 'COMPLETED')
      throw new Error('Response has already been completed');

    return router.push(`/evaluate/${response.responseId}`);
  };

  return (
    <li className="grid grid-cols-3 h-14 mb-2 select-none hover:border-border border border-transparent rounded-md p-2 transition">
      <span className="col-span-1 h-full flex flex-col justify-center">
        <p className="text-sm font-medium text-nowrap text-left">
          {truncate(response.formTitle, 40)}
        </p>
        <p className="text-sm text-nowrap items-center text-left text-neutral-500">
          <span className="flex flex-row space-x-1 items-center">
            <ClockIcon className="text-neutral-400" size={12} />
            <CountdownTimer
              targetDate={response.assessmentExpiresAt}
              showSeconds={false}
            />
          </span>
        </p>
      </span>
      <span className="col-span-1 pl-8 h-full flex flex-row justify-start items-center">
        <Avatar
          className="hover:scale-125 transition"
          tooltip={response.evaluateeName}
          content={getInitials(response.evaluateeName)}
        />
      </span>

      <span className="col-span-1 h-full flex items-center justify-end">
        <Button
          className={cn(
            'text-center bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center',
          )}
          variant="expandIcon"
          Icon={ArrowRightIcon}
          onClick={handleClick}
          iconPlacement="right"
          size="xs"
        >
          <p>
            {(() => {
              switch (response.status) {
                case 'COMPLETED':
                  return 'Review';
                case 'NOT_STARTED':
                  return 'Begin';
                case 'STARTED':
                  return 'Resume';
                default:
                  throw new Error('status not valid');
              }
            })()}
          </p>
        </Button>
      </span>
    </li>
  );
}

interface AssessmentRequestTableRowProps {
  request: AssessmentsWithRequestsResult[0];
}

export function AssessmentRequestTableRow({
  request,
}: AssessmentRequestTableRowProps) {
  const uniqueRespondees = new Map(
    request.responses.map((r) => [
      getFullName(r.respondee),
      {
        content: getInitials(getFullName(r.respondee)),
        tooltip: getFullName(r.respondee),
        className: 'bg-primary',
      },
    ]),
  );

  const requestedRespondeeAvatarData = Array.from(uniqueRespondees.values());

  return (
    <li className="grid grid-cols-3 h-14 mb-2 select-none hover:border-border border border-transparent rounded-md p-2 transition">
      <span className="col-span-1 h-full flex flex-col justify-center">
        <p className="text-sm font-medium text-nowrap text-left">
          {truncate(request.title, 15)}
        </p>
        <p className="text-xs text-nowrap items-center text-left mb-3 text-neutral-500">
          <span className="flex flex-row space-x-1 items-center">
            <ClipboardListIcon className="text-neutral-400" size={12} />
            <p>{truncate(request.form.title, 18)}</p>
          </span>
        </p>
      </span>

      <span className="col-span-1 h-full pb-3 flex flex-row justify-start pl-8 items-center">
        <AvatarStack avatars={requestedRespondeeAvatarData} />
      </span>
      <span className="col-span-1 h-full space-x-2 flex items-center justify-end">
        <Button
          className={cn(
            'text-center mb-3 bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center',
          )}
          variant="outline"
          size="xs"
        >
          <span>
            <AssessmentDetailsDialog assessmentId={request.id} />
          </span>
        </Button>
        <AssessmentRequestDropdown assessmentId={request.id} />
      </span>
    </li>
  );
}
