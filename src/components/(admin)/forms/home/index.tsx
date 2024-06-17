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
import { BookOpenIcon, StarsIcon, TelescopeIcon } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { Button } from "@/components/ui/button";

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
    useFilter<FormLiteResult>(orderedForms);

  const handleFilter = (
    filters: Partial<Record<string, any>>,
    reset?: boolean,
  ) => {
    setFilter(filters);
  };

  return (
    <>
      <div className="fixed right-[0px] top-[65px] px-8 w-full z-40" >
      <div className="flex flex-row justify-between rounded-lg items-center p-2 space-x-3 border-2 border-opacity-10 border-blue-200 overflow-y-hidden border-b bg-blue-800 bg-opacity-5 backdrop-blur-lg px-4 shadow-md">
        <FormHomeHeader />
        <div className="flex flex-row items-center space-x-3">

        <Input
          placeholder="Search Forms..."
          className={cn("text-md w-64 bg-blue-950 bg-opacity-5 backdrop-blur-3xl")}
          onChange={(e) => handleFilter({ title: e.target.value })}
        />
        <TagFilter
          tags={uniqueTags}
          onTagSelect={(tag) => setFilter({ "tags.tag": tag })}
          onTagRemove={() => removeFilter("tags.tag")}
        />
        </div>

      </div>
      </div>

      <div className="no-scrollbar grid  pt-20 grid-cols-7 gap-4">
        <motion.div
          initial={{ opacity: 0, y: random(7, 25) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full flex-col xs:col-span-7 lg:col-span-5"
        >
          <ScrollArea className={cn("h-[560px] pr-4")}>
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
            "xs:col-span-7 md:col-span-7 md:grid md:grid-cols-2 md:gap-1 lg:col-span-2 lg:h-full lg:grid-cols-1",
            "xs:space-y-1 md:space-y-0 lg:space-y-1",
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
    name: "Evaluate Students",
    description: "Assess student performance in a competency-based assessment.",
    Icon: StarsIcon,
    iconSize: "size-8",
    cta: (
        <Button variant={"hide"}>Start Assessment</Button>
    ),
    className: "w-full h-full col-span-1 ",
  },
  {
    name: "Resources",
    description: "Access ACGME guidelines to create high-quality assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className: "w-full lg:col-span-1 md:col-span-1 h-42",
    iconSize: "size-6",
    background: (
      <Image
        className={cn(
          "absolute left-[32%] top-[5px] transition-all [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:blur-sm",
        )}
        src={ACGME_LOGO}
        alt={"ACGME Logo"}
        height={150}
        width={150}
      />
    ),
  },

  {
    name: "Explore",
    description: "Browse community-made assessments.",
    Icon: TelescopeIcon,
    iconSize: "size-7",
    cta: "Explore Assessments",
    className: "w-full h-42 col-span-1 ",
  },
];
