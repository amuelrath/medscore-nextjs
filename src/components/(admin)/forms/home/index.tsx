'use client'
import React from 'react';
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { random } from "lodash";
import { cn } from "@/lib/helpers/utils";
import { FormLiteResult, getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { BentoCard, BentoCardProps } from "@/components/ui/bento-grid";
import { BookOpenIcon, FileIcon } from "lucide-react";
import { useFilter } from "@/hooks/use-filter";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { BooksIllustration } from "@/components/illustrations/books-illustration";
import { UpcomingAssessments } from "@/components/(admin)/forms/home/upcoming-assessments";
import WaterfallAnimation from "@/components/ui/waterfall-animation";

interface FormsListProps {
  filteredForms: FormLiteResult[];
}

const FormsList: React.FC<FormsListProps> = ({ filteredForms }) => {
  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: random(7, 25) }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-y-scroll h-[95%]"
      >
        <div className="h-full">
          <div className="grid grid-cols-2 gap-2 p-2">
            <WaterfallAnimation speed={0.02} noExit>
              {filteredForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </WaterfallAnimation>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const features: BentoCardProps[] = [
  {
    name: "Resources",
    description: "Access ACGME guidelines to create high-quality assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className: "w-full",
    iconSize: "size-8",
    background: <BooksIllustration />,
  },
];

export const FormsHome: React.FC = () => {
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
    useFilter(orderedForms);

  const handleFilter = (filters: Partial<Record<string, any>>) => {
    setFilter(filters);
  };

  return (
    <main className="flex flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-neutral-300 bg-card/50 p-1 pl-4 pr-2">
        <CreateFormDialogTrigger />
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-hidden p-4">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileIcon className="size-6 text-neutral-500" />
                <h3 className={cn("text-2xl font-bold text-neutral-700")}>
                  My Forms
                </h3>
              </div>
              <Input
                size="sm"
                placeholder="Search Forms..."
                className={cn("w-60 text-sm")}
                onChange={(e) => handleFilter({ title: e.target.value })}
              />
              <div className="flex items-center space-x-3">
                <TagFilter
                  tags={uniqueTags}
                  onTagSelect={(tag) => setFilter({ "tags.tag": tag })}
                  onTagRemove={() => removeFilter("tags.tag")}
                />
              </div>
            </div>
            <FormsList filteredForms={filteredForms} />
          </div>
        </div>
        <div className="w-1/3 flex-shrink-0 overflow-y-auto p-4">
          <div className="space-y-4">
            <UpcomingAssessments />
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

