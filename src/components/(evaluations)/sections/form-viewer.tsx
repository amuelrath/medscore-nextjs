"use client";
// TODO: Fix type error on the Form: It thinks that Date is gonna be a string for some weird ass reason
import { TFormRelate } from "@/db/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormCardHero } from "@/components/(evaluations)/viewer/form-card-hero";
import { FormCard } from "@/components/(evaluations)/viewer/form-card";
import { AnimatePresence } from "framer-motion";
import { CreateFormDialog } from "../dialogs/create-form-dialog";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function EvaluationsViewer({ forms }: { forms: TFormRelate[] }) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div className={cn("flex flex-col space-y-4 p-4")}>
      <div className={cn("flex flex-row justify-around")}>
        <div className={cn("flex space-x-8")}>
          <FormCardHero />
          <FormCardHero />
          <FormCardHero />
        </div>
      </div>
      <hr className={cn("my-4")} />
      <Section>
        <div className={cn("xl:grid-cols-2 grid grid-cols-1 gap-4")}>
          <div className={cn("flex flex-row items-center space-x-2")}>
            <Input
              className={cn("w-64")}
              placeholder="Search Drafts..."
              value={filter}
              onChange={(e) => handleSearch(e)}
            />
            <CreateFormDialog>
              <Button variant={"default"}>Create New Form</Button>
            </CreateFormDialog>
          </div>
          <AnimatePresence>
            {forms
              .filter((e) =>
                e.title
                  .toLocaleLowerCase()
                  .includes(filter.toLocaleLowerCase()),
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
      </Section>
    </div>
  );
}
