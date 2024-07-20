"use client";
import { formatDate, isAfter, isBefore } from "date-fns";
import Image from "next/image";
import EYEBALL from "public/image/eye.png";
import { cn } from "@/lib/helpers/utils";
import { CalendarClockIcon, UsersRoundIcon } from "lucide-react";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { useFormResultInEditorQuery } from "@/hooks/queries/use-form-result-in-editor-query";
import { Skeleton } from "@/components/ui/skeleton";
import { manageDialogSelectedAssessmentIdAtom } from "@/store/form-atoms";
import { useAtom } from "jotai";
import { m, LazyMotion, domAnimation } from "framer-motion";
import React from "react";

export function ScheduledAssessmentsSelect() {
  const { formResult, isLoading } = useFormResultInEditorQuery();

  const now = new Date();
  const activeFormCode = formResult?.assessments.find(
    (fc) =>
      isAfter(now, fc.startsAt) &&
      isBefore(now, fc.expiresAt) &&
      fc.canceledAt === null,
  );
  const scheduledAssessments = formResult?.assessments.filter(
    (fc) => isBefore(now, fc.startsAt) && !fc.canceledAt,
  );

  if (isLoading) {
    return <Skeleton className="h-[46vh] w-full" />;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="no-scrollbar h-[46vh] w-full space-y-2 overflow-y-scroll">
          {activeFormCode && (
            <ScheduleCard assessment={activeFormCode} status="active" />
          )}
          {(scheduledAssessments?.length || 0) > 0 && (
            <>
              {scheduledAssessments?.map((fc) => (
                <ScheduleCard key={fc.id} assessment={fc} status="scheduled" />
              ))}
            </>
          )}
      </div>
    </LazyMotion>
  );
}

interface ScheduleCardProps {
  assessment: FormResult["assessments"][number];
  status: "active" | "scheduled";
}

export function ScheduleCard({ assessment, status }: ScheduleCardProps) {
  const [activeId, setActiveId] = useAtom(
    manageDialogSelectedAssessmentIdAtom,
  );

  const assignedUsers = assessment.evaluatees.length;

  const startDate = assessment.startsAt ? new Date(assessment.startsAt) : null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(assessment.id);
  };

  return (
    <m.div
      layoutId={assessment.id}
      layout="position"
      onClick={handleClick}
      className={cn(
        "select-none rounded-xl p-3 transition-colors",
        activeId === assessment.id ? "bg-blue-800/5" : "hover:bg-blue-800/5",
      )}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-row items-center space-x-2">
            {assessment.isDirectObservation && (
              <Image src={EYEBALL} alt="eyeball-label" width={16} height={16} />
            )}
            <p> {assessment.title || "Untitled Administration"}</p>
            {status === "active" && (
              <span className=" size-2 animate-pulse rounded-full bg-accent-secondary" />
            )}
          </div>
          <div className="flex flex-row items-center space-x-3 text-xs text-neutral-500">
            <div className="flex select-none flex-row items-center space-x-2">
              <UsersRoundIcon className={cn("text-neutral-400/90")} size={16} />
              <p>{assignedUsers}</p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <CalendarClockIcon
                className={cn("text-neutral-400/90")}
                size={16}
              />
              <p>{formatDate(startDate || new Date(), "MM/dd/yyyy, h:mm a")}</p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
