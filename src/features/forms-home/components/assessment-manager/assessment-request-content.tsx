'use client'

import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Tab, TabsBox } from '@/components/ui/tabs-box';
import { getAssessmentsWithRequests } from '@/features/forms-home/actions/assessments/get-assessments-with-requests';
import {
  AssessmentRequestTableRow,
  ResponseTableRow,
} from '@/features/forms-home/components/assessment-manager/response-table';
import { getFullName } from '@/lib/get-full-name';
import { useQuery } from '@tanstack/react-query';
import { isBefore } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function NoDataRequested() {
  return (
    <div className="flex flex-grow justify-center items-center flex-col">
      <span className="opacity-80 text-center">
        <p className="text-xl font-semibold">You&apos;re all caught up!</p>
        <p className="text-md text-neutral-500">
          No action required at this time.
        </p>
      </span>
    </div>
  );
}

function NoDataCompleted() {
  return (
    <div className="flex flex-grow justify-center items-center flex-col">
      <span className="opacity-80 text-center">
        <p className="text-xl font-semibold">
          You haven&apos;t responded to any forms.
        </p>
        <p className="text-md text-neutral-500">
          Submitted responses will appear here.
        </p>
      </span>
    </div>
  );
}

export function AssessmentRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'Requests';

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => getAssessmentsWithRequests(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  useEffect(() => {
    if (!searchParams.get('tab')) {
      router.replace(`?tab=Requests`, undefined);
    }
  }, [router, searchParams]);

  if (isLoading || !assessments)
    return <Skeleton className="h-full w-full pb-10" />;

  const responses = assessments
    .flatMap((a) =>
      a.responses.map((r) => ({
        assessmentFormTitle: a.form.title,
        assessmentFormType: a.form.type,
        assessmentExpiresAt: a.expiresAt,
        ...r,
      })),
    )
    .filter((r) => r.respondee.id === process.env.NEXT_PUBLIC_DEV_USER_ID!); // todo fixme

  const now = new Date();
  const requested = responses
    .filter((r) => r.status === 'NOT_STARTED' || r.status === 'STARTED')
    .filter((r) => isBefore(now, r.assessmentExpiresAt))
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessmentFormTitle,
      formType: r.assessmentFormType,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee),
      assessmentExpiresAt: r.assessmentExpiresAt,
    }));

  const completed = responses
    .filter((r) => r.status === 'COMPLETED')
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessmentFormTitle,
      formType: r.assessmentFormType,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee),
      assessmentExpiresAt: r.assessmentExpiresAt,
    }));

  const CompletedRows = completed
    .sort(
      (a, b) => b.responseCreatedAt.getTime() - a.responseCreatedAt.getTime(),
    )
    .map((r) => (
      <ResponseTableRow
        key={r.responseId}
        responseId={r.responseId}
        responseCreatedAt={r.responseCreatedAt}
        formType={r.formType}
        formTitle={r.formTitle}
        status={r.status}
        assessmentExpiresAt={r.assessmentExpiresAt}
        evaluateeName={r.evaluateeName}
      />
    ));

  const AssessmentRows = assessments?.map((r) => (
    <AssessmentRequestTableRow key={r.id} request={r} />
  ));

  const RequestedRows = requested.map((r) => (
    <ResponseTableRow
      key={r.responseId}
      responseId={r.responseId}
      responseCreatedAt={r.responseCreatedAt}
      formType={r.formType}
      formTitle={r.formTitle}
      status={r.status}
      assessmentExpiresAt={r.assessmentExpiresAt}
      evaluateeName={r.evaluateeName}
    />
  ));

  const handleTabChange = (tabId: string) => {
    router.push(`?tab=${tabId}`, undefined);
  };

  const tabs: Tab[] = [
    {
      id: 'Assessments',
      label: (
        <div className="flex items-center justify-center space-x-1">
          <span>Assessments</span>
        </div>
      ),
      content: (
        <Suspense fallback={<Loading />}>
          <div className="p-4">
            <li className="grid grid-cols-3 h-4 border-b select-none pb-2 px-2 mb-4">
              <Label className="col-span-1" variant="light">
                Assessment
              </Label>
              <Label className="col-span-1 text-center" variant="light">
                Evaluators
              </Label>
              <Label className="col-span-1 text-end" variant="light">
                Actions
              </Label>
            </li>
            {AssessmentRows?.length ? AssessmentRows : <NoDataRequested />}
          </div>
        </Suspense>
      ),
    },
    {
      id: 'Requests',
      label: (
        <div className="flex justify-center items-center space-x-1">
          <span>Requests</span>
        </div>
      ),
      content: (
        <div className="p-4">
          <li className="grid grid-cols-3 h-4 border-b select-none pb-2 px-2 mb-4">
            <Label className="col-span-1" variant="light">
              Form
            </Label>
            <Label className="col-span-1 text-center" variant="light">
              Evaluatee
            </Label>
            <Label className="col-span-1 text-end" variant="light">
              Actions
            </Label>
          </li>
          {RequestedRows.length ? RequestedRows : <NoDataRequested />}
        </div>
      ),
    },
    {
      id: 'Completed',
      label: 'Completed',
      content: (
        <div className="p-4">
          <li className="grid grid-cols-3 h-4 border-b select-none pb-2 px-2 mb-4">
            <Label className="col-span-1" variant="light">
              Form
            </Label>
            <Label className="col-span-1 text-center" variant="light">
              Evaluatee
            </Label>
            <Label className="col-span-1 text-end" variant="light">
              Actions
            </Label>
          </li>
          {CompletedRows.length ? CompletedRows : <NoDataCompleted />}
        </div>
      ),
    },
  ];

  return (
    <TabsBox
      defaultTab={currentTab}
      tabs={tabs}
      onTabChange={handleTabChange}
    />
  );
}
