"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  FormLiteResult,
  getAllFormsLite,
} from "@/server/actions/forms/get-all-forms-lite";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { random } from "lodash";
import Image from "next/image";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { FormHomeHeader } from "@/components/(admin)/forms/navs/form-home-header";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { BentoCard, BentoCardProps } from "@/components/magicui/bento-grid";
import ACGME_LOGO from "public/image/ACGME_Logo.jpg";
import { BookOpenIcon, TelescopeIcon } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";

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
  const [filteredForms, setFilter, resetFilters, removeFilter] =
    useFilter<FormLiteResult>(forms);


  const handleFilter = (filters: Partial<Record<string, any>>, reset?: boolean) => {
    setFilter(filters);
  };

  return (
    <>
      <div className="flex flex-row items-center space-x-3">
        <FormHomeHeader />
        <Input
          placeholder="Search Forms..."
          className={cn("w-64")}
          onChange={(e) => handleFilter({ title: e.target.value })}
        />
        <TagFilter
          tags={uniqueTags}
          onTagSelect={(tag) => setFilter({ "tags.tag": tag })}
          onTagRemove={() => removeFilter("tags.tag")}
        />
      </div>
      <div className="no-scrollbar grid min-h-[79vh] grid-cols-7 gap-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: random(7, 25) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full flex-col xs:col-span-7 lg:col-span-5"
        >
          <ScrollArea className={cn("h-[100%] pr-4")}>
            <Scrollbar />
            <WaterfallAnimation noExit>
              {filteredForms.map((form) => (
                  <FormCard key={form.id} form={form} />
              ))}
            </WaterfallAnimation>
          </ScrollArea>
        </motion.div>
        <div
          className={cn(
            "xs:col-span-7 md:col-span-7 md:grid md:grid-cols-2 md:gap-4 lg:col-span-2 lg:h-full lg:grid-cols-1",
            "space-y-4 xs:space-y-4 md:space-y-0 lg:space-y-4",
          )}
        >
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
    name: "Resources",
    description:
      "Access ACGME guidelines to create high-quality, competency-based assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className: "w-full lg:col-span-1 md:col-span-1",
    background: (
      <Image
        className={cn(
          "absolute left-[32%] top-[15%]  transition-all [mask-image:linear-gradient(to_top,transparent_27%,#000_100%)] group-hover:blur-sm",
        )}
        src={ACGME_LOGO}
        alt={"ACGME Logo"}
        height={256}
        width={256}
      />
    ),
  },
  {
    name: "Explore",
    description: "Browse community-made assessments.",
    Icon: TelescopeIcon,
    cta: "Explore Assessments",
    className: "w-full h-48 col-span-1 ",
  },
];
