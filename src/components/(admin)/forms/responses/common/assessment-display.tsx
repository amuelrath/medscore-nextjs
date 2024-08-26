"use client";
import { ScientistIllustration } from "@/components/illustrations/scientist-illustration";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";
import { manageDialogOpenAtom } from "@/store/form-atoms";
import { isAfter, isBefore } from "date-fns";
import { useSetAtom } from "jotai";
import { RadioIcon } from "lucide-react";

export function AssessmentDisplay() {
  const setManageDialogOpen = useSetAtom(manageDialogOpenAtom);
  const { assessments, isLoading } = useGetFormAssessments();

  if (isLoading) return <>Loading...</>;

  const now = new Date();
  const activeAssessments = assessments.filter(
    (a) => isAfter(now, a.startsAt) && isBefore(now, a.expiresAt),
  );
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center justify-center space-x-2">
        <RadioIcon size={20} className="opacity-50" />
        <h3 className="text-lg font-semibold">Active Assessments</h3>
      </div>
      <Card className="flex flex-grow flex-col shadow-none items-center space-y-2 p-4">
        {activeAssessments.length > 0 ? (
          <div>{/* render assessments here */}</div>
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
