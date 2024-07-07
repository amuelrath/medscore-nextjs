"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  FormLiteResult,
  getAllFormsLite,
} from "@/server/actions/forms/get-all-forms-lite";
import { domAnimation, motion } from "framer-motion";
import { cn } from "@/lib/helpers/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { random } from "lodash";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { BentoCard, BentoCardProps } from "@/components/magicui/bento-grid";
import { BookOpenIcon, CalendarIcon, ClockIcon, FileIcon } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { Books } from "@/components/illustrations/books";
import { m, LazyMotion } from "framer-motion";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from "date-fns/isSameDay";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "date-fns";

export default function FormsHome() {
  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms", "lite"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const tags = forms.flatMap((f) => f.tags);
  const uniqueTags = [...new Set(tags.map((tag) => tag.tag))];

  const orderedForms = forms.sort(
    (a, b) =>
      new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime(),
  );
  const [filteredForms, setFilter, _, removeFilter] =
    useFilter<FormLiteResult>(orderedForms);

  const handleFilter = (filters: Partial<Record<string, any>>) => {
    setFilter(filters);
  };

  return (
    <main>
      <div className="flex h-12 w-full flex-row items-center justify-between border-b border-neutral-300 bg-card/50 p-1 pl-4 pr-2">
        <CreateFormDialogTrigger />
      </div>
      <hr className="h-[1px] w-full bg-neutral-300" />
      <div className="grid h-full grid-cols-5 p-4 ">
        <div className="col-span-3 flex flex-col">
          <div className="mb-2 flex flex-row items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileIcon className="size-6 text-neutral-500" />
              <h3 className={cn("text-2xl font-bold text-neutral-700")}>
                My Forms
              </h3>
            </div>
            <Input
              size="sm"
              placeholder="Search Forms..."
              className={cn("w-64 text-sm")}
              onChange={(e) => handleFilter({ title: e.target.value })}
            />
            <div className="flex flex-row items-center space-x-3">
              <TagFilter
                tags={uniqueTags}
                onTagSelect={(tag) => setFilter({ "tags.tag": tag })}
                onTagRemove={() => removeFilter("tags.tag")}
              />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: random(7, 25) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScrollArea className={cn("h-[650px] pr-4")}>
              <Scrollbar />
              <div className="grid grid-cols-2 gap-2 pb-32">
                <WaterfallAnimation speed={0.02} noExit>
                  {filteredForms.map((form) => (
                    <FormCard key={form.id} form={form} />
                  ))}
                </WaterfallAnimation>
              </div>
            </ScrollArea>
          </motion.div>
        </div>
        <div
          className={cn("col-span-2 flex w-full flex-col space-y-3 pb-28 pl-2")}
        >
          <UpcomingAssessments />
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}

const features: BentoCardProps[] = [
  {
    name: "Resources",
    description: "Access ACGME guidelines to create high-quality assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className: "w-full h-[35%]",
    iconSize: "size-8",
    background: <Books />,
  },
];

type Form = {
  formCodes: Array<{
    startsAt: Date;
    title: string;
  }>;
};

type DayContentProps = {
  date: Date;
  displayMonth: Date;
};

function UpcomingAssessments() {
  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms", "lite"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const upcomingAssessments = forms.flatMap(f => f.formCodes);

  const getAssessmentsForDay = (day: Date) => {
    return upcomingAssessments.filter(assessment => isSameDay(day, assessment.startsAt));
  };

  const DayContent: React.FC<DayContentProps> = ({ date }) => {
    const assessments = getAssessmentsForDay(date);
    if (assessments.length === 0) return <div>{date.getDate()}</div>;

    return (
      <TooltipProvider>
        <Tooltip delayDuration={0} >
          <TooltipTrigger asChild>
            <div>{date.getDate()}</div>
          </TooltipTrigger>
          <TooltipContent className="mb-3" >
            {assessments.map((assessment) => (
              <div key={assessment.id} className="space-y-1" >
              <div  className="font-medium text-neutral-700">{assessment.title}</div>
                <p className="text-neutral-600" >{forms.find(f => f.formCodes?.find(fc => fc.id === assessment.id))?.title}</p>
              <div className="flex flex-row items-center justify-center space-x-2">
                <ClockIcon size={14} className="text-neutral-400" />
                <p className="text-neutral-500 text-xs" >{formatDate(assessment.startsAt.toLocaleString(), "H : mm a")}</p>
              </div>
              </div>
            ))}
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
          className="h-[325px] w-full rounded-xl border border-neutral-300 bg-card px-3 pb-3 [box-shadow:0_0_0_1px_rgba(0,0,0,.05),0_2px_4px_rgba(0,0,0,.07),0_12px_24px_rgba(0,0,0,.05)]"
        >
          <div className="h-full overflow-hidden">
            <Calendar
              className="w-full select-none"
              selected={(date: Date) => !!upcomingAssessments?.find(ua => isSameDay(date, ua.startsAt))}
              // @ts-expect-error
              components={{ DayContent }}
              classNames={{
                months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-3 w-full flex flex-col",
                table: "w-full border-collapse space-y-1",
                head_row: "",
                row: "w-full mt-2",
                caption_label: "text-xl font-semibold",
                day_today: "bg-accent-secondary-background",
                day_selected: cn("bg-accent-secondary text-teal-950 cursor-pointer hover:bg-accent-secondary/80")
              }}
            />
          </div>
        </m.div>
      </LazyMotion>
    </>
  );
}