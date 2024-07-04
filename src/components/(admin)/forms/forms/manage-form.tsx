"use client";
import { differenceInHours, formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarClockIcon, Edit2, UsersRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormResult, getFormById } from "@/server/actions/forms/get-form-by-id";
import { useFormContext } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ManageContent() {
  const { getValues } = useFormContext<TFormRelate>();
  const formId = getValues(`id`);
  const { data: formResult } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  if (!formResult) {
    return <div>This form could not be fetched!</div>;
  }

  const now = new Date();
  const allFormCodes = formResult.formCodes;
  const allUsersInProgram = formResult.programs.users.map((u) => u.user);

  const pastFormCodes = allFormCodes.filter(
    (fc) => new Date(fc.expiresAt) < now || fc.canceledAt,
  );
  const scheduledFormCodes = allFormCodes.filter(
    (fc) => fc.startsAt && new Date(fc.startsAt) > now,
  );
  const activeFormCode = allFormCodes.find(
    (fc) =>
      fc.startsAt &&
      new Date(fc.startsAt) <= now &&
      new Date(fc.expiresAt) > now &&
      !fc.canceledAt,
  );

  return (
    <div className="no-scrollbar h-[55vh] w-full overflow-y-scroll">
      {activeFormCode && (
        <div className="mb-4">
          <h3 className="text-md font-semibold">Active</h3>
          <ScheduleCard
            formCode={activeFormCode}
            users={allUsersInProgram}
            active
          />
        </div>
      )}
      {scheduledFormCodes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold">Scheduled</h3>
          <div className="space-y-2">
            {scheduledFormCodes.map((fc) => (
              <ScheduleCard
                key={fc.id}
                formCode={fc}
                users={allUsersInProgram}
              />
            ))}
          </div>
        </div>
      )}
      {pastFormCodes.length > 0 && (
        <div>
          <h3 className="text-md font-semibold">Previous</h3>
          <div className="space-y-2">
            {pastFormCodes.map((fc) => (
              <ScheduleCard
                key={fc.id}
                formCode={fc}
                users={allUsersInProgram}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScheduleCardProps {
  formCode: FormResult["formCodes"][number];
  users: FormResult["programs"]["users"][number]["user"][];
  active?: boolean;
}

function ScheduleCard({ formCode, users, active }: ScheduleCardProps) {
  const assignedUsers = formCode.usersWithCode
    .map((uc) => users.find((u) => u.id === uc.userId))
    .filter((u): u is NonNullable<typeof u> => u !== undefined);

  const startDate = formCode.startsAt ? new Date(formCode.startsAt) : null;
  const endDate = new Date(formCode.expiresAt);

  const getDurationBadgeColor = () => {
    const hours = differenceInHours(endDate, startDate || new Date());
    if (hours <= 4) return "bg-green-100 text-green-800";
    if (hours <= 24) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-xl border bg-card p-3 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-grow space-y-1.5">
          <div className="flex flex-row items-center space-x-2">
            <p> {formCode.title || "Untitled Administration"}</p>
            {active && (
              <span className=" size-2 animate-pulse rounded-full bg-destructive" />
            )}
          </div>
          <div className="flex flex-row items-center space-x-3 text-xs text-neutral-500">
            <div className="flex select-none flex-row items-center space-x-2">
              <UsersRoundIcon className={cn("text-neutral-400/90")} size={16} />
              <p>{assignedUsers.length}</p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <CalendarClockIcon
                className={cn("text-neutral-400/90")}
                size={16}
              />
              <p>{formatDate(startDate || new Date(), "MM/dd/yyyy, h:mm a")}</p>
            </div>
            <Badge
              size="xs"
              variant="outline"
              className={cn(
                getDurationBadgeColor(),
                "space-x-0.5 border-none px-[8px] py-[2.5px] text-2xs font-normal",
              )}
            >
              <p className="font-medium">
                {differenceInHours(endDate, startDate || new Date())}
              </p>
              <p className="font-light">hours</p>
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
