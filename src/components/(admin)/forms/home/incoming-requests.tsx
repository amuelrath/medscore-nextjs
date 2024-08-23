'use client';

import {
  ResponseTable,
  ResponseTableContent,
  ResponseTableHeader,
  ResponseTableNotification,
  ResponseTableRow,
} from '@/components/(admin)/forms/home/response-table';
import LetterPullup from '@/components/ui/letter-pull-up';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getFullName } from '@/lib/helpers/getFullName';
import { getAssessmentsWithRequests } from '@/server/actions/assessments/get-assessments-with-requests';
import { useQuery } from '@tanstack/react-query';
import { isBefore } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryIcon, InboxIcon } from 'lucide-react';
import { useState } from 'react';

type Tabs = 'REQUESTS' | 'COMPLETED';

function NoDataRequested() {
  return (
    <div className="flex flex-grow justify-center items-center flex-col">
      <span className="opacity-80 text-center">
        <p className="text-xl  font-semibold">You&apos;re all caught up!</p>
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

export function IncomingRequests() {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => getAssessmentsWithRequests(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const responses = assessments
    ?.flatMap((a) =>
      a.responses.map((r) => ({
        assessmentFormTitle: a.form.title,
        assessmentFormType: a.form.type,
        assessmentExpiresAt: a.expiresAt,
        ...r,
      })),
    )
    .filter((r) => r.respondee.id === process.env.NEXT_PUBLIC_DEV_USER_ID!); // todo fixme

  const [activeTab, setActiveTab] = useState<Tabs>('REQUESTS');

  if (isLoading || !responses)
    return <Skeleton className="h-full w-full pb-10" />;
  const now = new Date();
  const requested = responses
    .filter((r) => r.status === 'NOT_STARTED' || r.status === 'STARTED')
    .filter((r) => isBefore(now, r.assessmentExpiresAt))
    .filter(
      (r) =>
        r.assessmentFormTitle.toLowerCase() ||
        getFullName(r.evaluatee)?.toLowerCase(),
    )
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
    .filter(
      (r) =>
        r.assessmentFormTitle.toLowerCase() ||
        getFullName(r.evaluatee)?.toLowerCase(),
    )
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

  const RequestedHeader = (
    <>
      <InboxIcon className="size-5 opacity-70" />
      <LetterPullup
        key={activeTab}
        delay={0.01}
        fontWeight="semibold"
        size="lg"
        words="Incoming Requests"
      />
      <ResponseTableNotification requests={requested.length} />
    </>
  );

  const CompletedHeader = (
    <>
      <HistoryIcon className="size-5 opacity-70" />
      <LetterPullup
        key={activeTab}
        size="lg"
        delay={0.01}
        fontWeight="semibold"
        words="Previous Responses"
      />
    </>
  );

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

  return (
    <ResponseTable>
      <ResponseTableHeader>
        <span className="flex text-md flex-row w-full space-x-2 font-semibold text-neutral-600 items-center">
          {activeTab === 'COMPLETED' ? CompletedHeader : RequestedHeader}
        </span>
        <Select
          onValueChange={(val: Tabs) => setActiveTab(val)}
          defaultValue={activeTab}
        >
          <SelectTrigger className="w-12 ring-transparent transition-none focus-visible:ring-transparent focus:ring-transparent border-0 text-xs bg-transparent" />
          <SelectContent>
            <SelectItem value="REQUESTS">Incoming Requests</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </ResponseTableHeader>
      <ResponseTableContent>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex h-full"
          >
            {(() => {
              switch (activeTab) {
                case 'COMPLETED':
                  return completed.length ? CompletedRows : <NoDataCompleted />;
                case 'REQUESTS':
                  return requested.length ? RequestedRows : <NoDataRequested />;
                default:
                  return null;
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </ResponseTableContent>
    </ResponseTable>
  );
}
