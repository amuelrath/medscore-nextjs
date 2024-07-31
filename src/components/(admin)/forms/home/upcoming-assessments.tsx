import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { isSameDay } from "date-fns/isSameDay";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, ChevronRightIcon, ClockIcon } from "lucide-react";
import { formatDate } from "date-fns";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/helpers/utils";
import { useRouter } from "next/navigation";
import {
  manageDialogOpenAtom,
  manageDialogSelectedAssessmentIdAtom,
} from "@/store/form-atoms";
import { useSetAtom } from "jotai";

export function UpcomingAssessments() {
  const setManageDialogOpen = useSetAtom(manageDialogOpenAtom);
  const setActiveCodeId = useSetAtom(manageDialogSelectedAssessmentIdAtom);
  const router = useRouter();

  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const upcomingAssessments = forms.flatMap((f) => f.assessments);

  const getAssessmentsForDay = (day: Date) => {
    return upcomingAssessments.filter((assessment) =>
      isSameDay(day, assessment.startsAt),
    );
  };

  const DayContent = ({ date }: { date: Date }) => {
    const assessments = getAssessmentsForDay(date);
    if (assessments.length === 0) return <div>{date.getDate()}</div>;

    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>{date.getDate()}</div>
          </TooltipTrigger>
          <TooltipContent className="mb-3 px-1.5">
            {assessments.map((assessment) => {
              const formId = forms.find((f) =>
                f.assessments.find((fc) => fc.id === assessment.id),
              )?.id;
              const handleClick = () => {
                setManageDialogOpen(true);
                setActiveCodeId(assessment.id);
                router.push(`/forms/${formId}`);
              };

              return (
                <div
                  key={assessment.id}
                  className="group flex cursor-pointer flex-col items-start space-y-1 rounded p-2 transition-all hover:bg-background"
                  onClick={handleClick}
                >
                  <div className="flex items-center justify-between space-x-2 font-medium text-neutral-700">
                    <span>{assessment.title}</span>
                    <ChevronRightIcon
                      size={16}
                      className="text-teal-950 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <p className="text-neutral-600">
                    {
                      forms.find((f) =>
                        f.assessments?.find((fc) => fc.id === assessment.id),
                      )?.title
                    }
                  </p>
                  <div className="flex flex-row items-center space-x-2">
                    <ClockIcon size={14} className="text-neutral-400" />
                    <p className="text-xs text-neutral-500">
                      {formatDate(assessment.startsAt, "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className="flex flex-row items-center space-x-2">
        <CalendarIcon className="size-6 text-neutral-500" />
        <h3 className="text-2xl font-bold text-neutral-700">
          Upcoming Assessments
        </h3>
      </div>
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: Math.random() * (25 - 7) + 7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-[325px] w-full flex-col justify-center rounded-xl border border-neutral-300 bg-card px-3 shadow-sm"
        >
          <div className="overflow-hidden">
            <Calendar
              className="w-full select-none"
              selected={(date: Date) =>
                !!upcomingAssessments?.find((ua) =>
                  isSameDay(date, ua.startsAt),
                )
              }
              components={{ DayContent }}
              classNames={{
                months:
                  "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-3 w-full flex flex-col",
                table: "w-full border-collapse space-y-1",
                head_row: "",
                row: "w-full mt-2",
                caption_label: "text-xl font-semibold",
                day_today: "bg-accent-secondary-background",
                day_selected: cn(
                  "bg-accent-secondary text-teal-950 cursor-pointer hover:bg-accent-secondary/80",
                ),
              }}
            />
          </div>
        </m.div>
      </LazyMotion>
    </>
  );
}
