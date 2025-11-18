'use client';

import { AllUsersResult, getAllUsers } from '@/actions/programs/get-all-users';
import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
import { AVATAR_ROLE_COLOR_MAP } from '@/constants/style-maps';
import { TAssessmentComponentSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { getFullName } from '@/lib/get-full-name';
import { getInitials } from '@/lib/get-initials';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { groupBy } from 'lodash';
import { CalendarIcon, SendIcon, UsersIcon } from 'lucide-react';
import { useMemo } from 'react';

function TimingConflictWarning() {
  return (
    <div className="flex border border-yellow-500 items-center space-x-2 p-2 rounded w-full bg-yellow-50 text-yellow-700">
      <ExclamationTriangleIcon className="size-[16px]" />
      <span>Overlaps with existing evaluation window</span>
    </div>
  );
}

interface EvaluateeBadgeProps {
  evaluatee: AllUsersResult[number];
}

function EvaluateeBadge({ evaluatee }: EvaluateeBadgeProps) {
  return (
    <Badge
      size="md"
      variant="secondary"
      className="space-x-2 pl-1.5 py-1.5 text-sm bg-opacity-50"
    >
      <div className="flex flex-row items-center space-x-2">
        <Avatar size="xs" content={getInitials(evaluatee)} />
        <span className="font-normal">{getFullName(evaluatee)}</span>
      </div>
    </Badge>
  );
}

interface RequestReviewCardProps {
  component: TAssessmentComponentSchema;
  userMap: Map<string, AllUsersResult[number]>;
}

function RequestReviewCard({ component, userMap }: RequestReviewCardProps) {
  const { title, formTitle, startsAt, expiresAt } = component;
  const formatted =
    format(startsAt, 'MM/dd/yyyy') === format(expiresAt, 'MM/dd/yyyy')
      ? `${format(startsAt, 'MM/dd/yyyy  •  hh:mm a')} - ${format(expiresAt, 'hh:mm a')}`
      : `${format(startsAt, 'MM/dd/yyyy  •  hh:mm a')} - ${format(expiresAt, 'MM/dd/yyyy  •  hh:mm a')}`;
  const evaluateeIds = component.evaluateeIds;
  const evaluatees = evaluateeIds
    ?.map((id) => userMap.get(id))
    .filter((u) => u !== undefined);

  return (
    <div className="flex flex-col space-y-4 bg-card p-4 border border-border rounded-md">
      <div className="flex items-center space-x-2">
        <span className="text-base font-medium">
          {`${title} - ${formTitle}`}
        </span>
      </div>
      {component.type !== 'SURVEY' && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <UsersIcon size={16} className="opacity-50" />
          </div>
          <div className="space-x-2">
            {evaluatees?.map((e) => (
              <EvaluateeBadge key={e.id} evaluatee={e} />
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <CalendarIcon size={16} className="opacity-50" />
        <span className="text-neutral-500">{formatted}</span>
      </div>
    </div>
  );
}

interface RespondeeAccordionItemProps {
  userMap: Map<string, AllUsersResult[number]>;
  respondee: AllUsersResult[number];
}

function formatRequests(
  count: number,
  type: 'evaluation' | 'survey',
): string | null {
  if (count <= 0) return null;

  const typeLabel = type === 'evaluation' ? 'Evaluation' : 'Survey';
  const plural = count === 1 ? 'Request' : 'Requests';
  return `${count} ${typeLabel} ${plural}`;
}

function RespondeeAccordionItem({
  userMap,
  respondee,
}: RespondeeAccordionItemProps) {
  const components = useAssessmentWizardStore((s) => s.components);

  // get each component where the respondee is listed
  const requestedComponents = components.filter((c) =>
    c.respondeeIds.includes(respondee.id),
  );

  const groupedComponents = groupBy(requestedComponents, (c) => c.type);
  const surveyRequests = Number(groupedComponents.SURVEY?.length || 0);
  const evaluationRequests =
    Number(groupedComponents?.EVALUATION?.length || 0) +
    Number(groupedComponents?.STATION?.length || 0);

  return (
    <AccordionItem value={respondee.id}>
      <AccordionTrigger>
        <div className="w-full pr-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <Avatar
              content={getInitials(respondee)}
              size="md"
              color={AVATAR_ROLE_COLOR_MAP[respondee.role]}
            />
            <div className="flex flex-col items-start -space-y-1">
              <span className="text-md">{getFullName(respondee)}</span>
              <span className="text-neutral-500 text-sm font-normal">
                <span className="text-neutral-500 text-sm font-normal">
                  {evaluationRequests > 0 &&
                    formatRequests(evaluationRequests, 'evaluation')}
                  {evaluationRequests > 0 && surveyRequests > 0 && ' • '}{' '}
                  {surveyRequests > 0 &&
                    formatRequests(surveyRequests, 'survey')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-primary/5 space-y-2 rounded p-2 mb-2">
        {requestedComponents?.map((c) => (
          <RequestReviewCard key={c.id} component={c} userMap={userMap} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function getNumberRequests({
  components,
}: {
  components: TAssessmentComponentSchema[];
}) {
  return components.reduce((acc, c) => {
    if (c.type === 'STATION' || c.type === 'EVALUATION') {
      const numRespondents = c.respondeeIds.length;
      const numEvaluatees = c.evaluateeIds?.length ?? 0;
      return acc + numRespondents * numEvaluatees;
    }

    if (c.type === 'SURVEY') {
      const numRespondents = c.respondeeIds.length;
      return acc + numRespondents;
    }

    return acc;
  }, 0);
}

export function AssessmentReviewAndDeployForm() {
  const details = useAssessmentWizardStore((s) => s.details);
  const components = useAssessmentWizardStore((s) => s.components);

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    // todo fixme add actual user's programId
    queryKey: ['users', 'a5d6ff06-c3c5-44c1-9bb3-8d9641b87081'],
    queryFn: () =>
      getAllUsers({ programId: 'a5d6ff06-c3c5-44c1-9bb3-8d9641b87081' }),
  });

  // map users based on id for easy access
  const userMap = new Map(users?.map((u) => [u.id, u]));

  // get respondees
  const respondeeIds = components.flatMap((c) => c.respondeeIds);
  const respondees = [...new Set(respondeeIds)]
    .map((id) => userMap.get(id))
    .filter((u) => u !== undefined);

  const numReqs = useMemo(
    () => getNumberRequests({ components }),
    [components],
  );

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent className="justify-between">
          <div className="flex flex-row space-x-2 items-center">
            <FormSectionHeaderIcon Icon={SendIcon} />
            <FormSectionHeaderTitle>Requests</FormSectionHeaderTitle>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-8 text-xs text-neutral-500">
              <div className="flex items-center space-x-2">
                <UsersIcon size={16} className="opacity-50" />
                <span>{respondees.length} Respondents</span>
              </div>
              <div className="flex items-center space-x-2">
                <SendIcon size={16} className="opacity-50" />
                <span>{numReqs} Total Requests</span>
              </div>
            </div>
          </div>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div className="overflow-y-scroll overflow-x-hidden h-[505px]">
        <Accordion type="single" defaultValue={respondees[0].id}>
          {respondees.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: -5 * (idx + 1) }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RespondeeAccordionItem respondee={r} userMap={userMap} />
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
