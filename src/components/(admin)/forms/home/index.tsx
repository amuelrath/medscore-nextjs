"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FormLiteResult, getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { random } from "lodash";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { BentoCard, BentoCardProps } from "@/components/magicui/bento-grid";
import { BookOpenIcon, ClipboardPlusIcon, EyeIcon } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { Button } from "@/components/ui/button";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { StartObservationDialog } from "@/components/(admin)/forms/dialogs/start-observation-dialog";
import { Books } from "@/components/illustrations/books";
import { Survey } from "@/components/illustrations/survey";
import { Doctors } from "@/components/illustrations/doctors";

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
    <>
      <div className="h-16 w-full">
        <div className="flex h-16 flex-row justify-between border-b border-accent-secondary bg-card p-1 px-8">
          <div className="flex flex-row items-center space-x-4">
            <h3
              className={cn(
                "align-middle text-2xl font-bold text-neutral-700 xs:text-2xl",
              )}
            >
              My Forms
            </h3>
            <Input
              placeholder="Search Forms..."
              className={cn(
                "text-md w-64 bg-blue-950 bg-opacity-5 shadow-inner backdrop-blur-3xl",
              )}
              onChange={(e) => handleFilter({ title: e.target.value })}
            />
          </div>
          <div className="flex flex-row items-center space-x-3">
            <TagFilter
              tags={uniqueTags}
              onTagSelect={(tag) => setFilter({ "tags.tag": tag })}
              onTagRemove={() => removeFilter("tags.tag")}
            />
            <CreateFormDialogTrigger />
          </div>
        </div>
      </div>
      <div className="grid h-full grid-cols-5 p-4 ">
        <motion.div
          initial={{ opacity: 0, y: random(7, 25) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-3 flex flex-col"
        >
          <ScrollArea className={cn("h-[620px] pr-4")}>
            <Scrollbar />
            <WaterfallAnimation noExit>
              {filteredForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </WaterfallAnimation>
          </ScrollArea>
        </motion.div>
        <div className={cn("col-span-2 flex w-full flex-col space-y-3 pl-2")}>
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </div>
      </div>
    </>
  );
}

const features: BentoCardProps[] = [
  {
    name: "Evaluate Students",
    description: "Assess student performance in a competency-based assessment.",
    Icon: ClipboardPlusIcon,
    background: <Doctors />,
    iconSize: "size-8",
    cta: <Button variant={"hide"}>Begin Assessment</Button>,
    className: "w-full h-full",
  },
  {
    name: "Direct Observation",
    description: "Assess student performance in live clinical encounters",
    Icon: EyeIcon,
    background: <Survey />,
    iconSize: "size-8",
    cta: <StartObservationDialog>Start Observation</StartObservationDialog>,
    className: "w-full h-full ",
  },
  {
    name: "Resources",
    description: "Access ACGME guidelines to create high-quality assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className: "w-full h-full",
    iconSize: "size-8",
    background: <Books />,
  },
];
