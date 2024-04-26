"use client";
// TODO: Wire up form creator
// TODO: Fix type error on the Form: It thinks that Date is gonna be a string for some weird ass reason
import { TFormRelate } from "@/db/types";
import { trpc } from "@/app/_trpc/client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormCardHero } from "@/components/(evaluations)/viewer/form-card-hero";
import { FormCard } from "@/components/(evaluations)/viewer/form-card";
import { AnimatePresence } from "framer-motion";

export default function EvaluationsViewer() {
  const [filter, setFilter] = useState<string>("");
  const formsQuery = trpc.forms.getAllForms.useSuspenseQuery({
    userId: "cf8b381f-1956-4c56-acf3-cf7517b20b92",
  });

  const formsData = formsQuery[1].data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div className={cn("flex flex-col space-y-4")}>
      <div className={cn("flex flex-row justify-around")}>
        <div className={cn("flex space-x-8")}>
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
        </div>
      </div>
      <hr className={cn("my-4")} />
      <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-4")}>
        <div className={cn("flex flex-row space-x-2 items-center")}>
          <Input
            className={cn("w-64")}
            placeholder="Search Drafts..."
            value={filter}
            onChange={(e) => handleSearch(e)}
          />
        </div>
        <AnimatePresence>
          {formsData
            .filter((e) =>
              e.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
            )
            .sort((a, b) => {
              const dateA = new Date(a.lastOpenedAt);
              const dateB = new Date(b.lastOpenedAt);
              return dateB.getTime() - dateA.getTime();
            })
            .map((form, index) => (
              <FormCard
                key={form.id}
                form={form as unknown as TFormRelate}
                index={index}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
