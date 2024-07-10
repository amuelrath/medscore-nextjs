"use client";
import { formatDate, isAfter, isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import EYEBALL from "public/image/eye.png";
import { cn } from "@/lib/helpers/utils";
import { CalendarClockIcon, UsersRoundIcon } from "lucide-react";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { FormCodeDisplay } from "@/components/(admin)/forms/form-code-display";
import { useFormResultInEditorQuery } from "@/hooks/queries/use-form-result-in-editor-query";
import { Skeleton } from "@/components/ui/skeleton";
import { manageDialogSelectedCodeIdAtom } from "@/store/form-atoms";
import { useAtom } from "jotai";
import React from "react";

export function ScheduledAssessmentsSelect() {
  const { formResult, isLoading, error } = useFormResultInEditorQuery();

  const now = new Date();
  const activeFormCode = formResult?.formCodes.find(
    (fc) =>
      isAfter(now, fc.startsAt) &&
      isBefore(now, fc.expiresAt) &&
      fc.canceledAt === null,
  );
  const scheduledFormCodes = formResult?.formCodes.filter(
    (fc) => isBefore(now, fc.startsAt) && !fc.canceledAt,
  );

  if (isLoading) {
    return <Skeleton className="h-[46vh] w-full" />;
  }

  return (
    <div className="no-scrollbar h-[46vh] w-full overflow-y-scroll">
      {activeFormCode && (
        <div className="mb-4">
          <h3 className="text-md font-semibold">Active</h3>
          <ScheduleCard formCode={activeFormCode} status="active" />
        </div>
      )}
      {(scheduledFormCodes?.length || 0) > 0 && (
        <div className="mb-4">
          <div className="space-y-2">
            {scheduledFormCodes?.map((fc) => (
              <ScheduleCard key={fc.id} formCode={fc} status="scheduled" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScheduleCardProps {
  formCode: FormResult["formCodes"][number];
  status: "active" | "scheduled";
}

export function ScheduleCard({ formCode, status }: ScheduleCardProps) {
  const [activeCodeId, setActiveCodeId] = useAtom(
    manageDialogSelectedCodeIdAtom,
  );

  const assignedUsers = formCode.usersWithCode.length;

  const startDate = formCode.startsAt ? new Date(formCode.startsAt) : null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCodeId(formCode.id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "select-none rounded-xl p-3 transition-colors",
        activeCodeId === formCode.id ? "bg-blue-800/5" : "hover:bg-blue-800/5",
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-row items-center space-x-2">
            {formCode.isDirectObservation && (
              <Image src={EYEBALL} alt="eyeball-icon" width={16} height={16} />
            )}
            <p> {formCode.title || "Untitled Administration"}</p>
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

        {status === "active" && <FormCodeDisplay code={formCode.code} />}
      </div>
    </div>
  );
}
