"use client";
import { Card } from "@/components/ui/card";
import { ClockIcon, KeyIcon, RadioIcon, UsersIcon } from "lucide-react";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import {
  differenceInHours,
  differenceInMinutes,
  isAfter,
  isBefore,
} from "date-fns";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";
import {
  manageDialogOpenAtom,
  selectedAssessmentIdAtom,
} from "@/store/form-atoms";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ActiveAssessmentDropdown } from "@/components/(admin)/forms/responses/dropdowns/active-assessment-dropdown";
import { toast } from "sonner";
import { m } from "framer-motion";
import EasyTooltip from "@/components/ui/easy-tooltip";
import { ScientistIllustration } from "@/components/illustrations/scientist-illustration";

const MotionButton = m(Button);

export function ActiveAssessmentsCard() {
  const setManageDialogOpen = useSetAtom(manageDialogOpenAtom);
  const { assessments, isLoading } = useGetFormAssessments();

  if (isLoading) return <>Loading...</>;

  const now = new Date();
  const activeAssessments = assessments.filter(
    (a) =>
      isAfter(now, a.startsAt) && isBefore(now, a.expiresAt) && !a.canceledAt,
  );
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center justify-center space-x-2">
        <RadioIcon size={20} className="opacity-50" />
        <h3 className="text-lg font-semibold">Active Assessments</h3>
      </div>
      <Card className="flex flex-grow flex-col shadow-none items-center space-y-2 p-4">
        {activeAssessments.length > 0 ? (
          activeAssessments.map((a) => (
            <ActiveAssessmentCard key={a.id} assessment={a} />
          ))
        ) : (
          <div className="my-auto">
            <ScientistIllustration />
            <div className="mt-2 flex flex-col items-center -space-y-1">
              <p className="font-semibold">No Active Assessments</p>
              <Button
                onClick={() => setManageDialogOpen(true)}
                variant="link"
                className="text-foreground/70"
                size="xs"
              >
                Create New Assessment
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

interface ActiveAssessmentCardProps {
  assessment: AssessmentsResult[number];
}

export function ActiveAssessmentCard({
  assessment,
}: ActiveAssessmentCardProps) {
  const setSelectedAssessmentId = useSetAtom(selectedAssessmentIdAtom);
  const accessCode = assessment.code;
  const numberOfEvaluatees = assessment.evaluatees.length;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(accessCode);
    toast.info("Access code copied to clipboard.");
  };

  const handleNameClick = () => {
    setSelectedAssessmentId(assessment.id);
  };

  return (
    <div className="flex h-14 w-full flex-row items-center justify-between rounded-md border border-neutral-200 py-2 pl-2 transition-all hover:border-neutral-300">
      <div className="flex max-w-[50%] flex-col space-y-1">
        <EasyTooltip tooltipContent={assessment.title}>
          <div
            className="flex cursor-pointer items-center space-x-2 flex-row overflow-hidden hover:underline"
            onClick={handleNameClick}
          >
            <span className="size-2 animate-pulse rounded-full bg-accent-secondary" />
            <p className="truncate text-xs">{assessment.title}</p>

          </div>
        </EasyTooltip>

        <div className="flex flex-row items-center space-x-2 text-xs">
          <div className="flex flex-row items-center space-x-1 opacity-50">
            <UsersIcon size={10} />
            <p>{numberOfEvaluatees}</p>
          </div>
          <div className="flex flex-row items-center space-x-1 opacity-50">
            <ClockIcon size={10} />
            <p>{formatDuration(assessment.startsAt, assessment.expiresAt)}</p>
          </div>
        </div>
      </div>
      <div>
        <MotionButton
          whileTap={{ scale: 0.75 }}
          variant="secondary"
          size="xs"
          onMouseDown={handleCopyCode}
        >
          <KeyIcon size={16} />
        </MotionButton>

        <ActiveAssessmentDropdown assessmentId={assessment.id}>
          <Button variant="hide">
            <DotsHorizontalIcon className="size-5 opacity-50 hover:opacity-100" />
          </Button>
        </ActiveAssessmentDropdown>
      </div>
    </div>
  );
}
const formatDuration = (start: Date, end: Date) => {
  const hours = differenceInHours(new Date(end), new Date(start));
  const minutes = differenceInMinutes(new Date(end), new Date(start)) % 60;
  return `${hours}h ${minutes}m`;
};
