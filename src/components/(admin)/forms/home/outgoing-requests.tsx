'use client';

import {
  AssessmentRequestTableRow,
  ResponseTable,
  ResponseTableContent,
  ResponseTableHeader,
} from '@/components/(admin)/forms/home/response-table';
import LetterPullup from '@/components/ui/letter-pull-up';
import { getAssessmentsWithRequests } from '@/server/actions/assessments/get-assessments-with-requests';
import { getAllFormsLite } from '@/server/actions/forms/get-all-forms-lite';
import { useQueries } from '@tanstack/react-query';
import { CircleArrowOutUpRightIcon } from 'lucide-react';

export function OutgoingRequests() {
  const [requests, forms] = useQueries({
    queries: [
      {
        queryKey: ['assessments'],
        queryFn: () => getAssessmentsWithRequests(),
      },
      {
        queryKey: ['forms'],
        queryFn: () =>
          getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
      },
    ],
  });

  const { data: assessmentRequests, isLoading: isRequestsLoading } = requests;
  const { data: allForms, isLoading: isFormsLoading } = forms;

  if (isRequestsLoading || isFormsLoading) return null;
  if (!allForms) return <>no forms</>;

  return (
    <ResponseTable>
      <ResponseTableHeader>
        <span className="flex text-md flex-row w-full justify-between font-semibold text-neutral-600 items-center">
          <span className="space-x-2 items-center flex flex-row">
            <CircleArrowOutUpRightIcon className="size-5 opacity-70" />
            <LetterPullup
              size="lg"
              delay={0.01}
              fontWeight="semibold"
              words="Ongoing Assessments"
            />
          </span>
        </span>
      </ResponseTableHeader>
      <ResponseTableContent>
        {assessmentRequests?.map((r) => (
          <AssessmentRequestTableRow key={r.id} request={r} />
        ))}
      </ResponseTableContent>
    </ResponseTable>
  );
}
