"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import { FormCardHero } from "@/components/(admin)/forms/viewer/form-card-hero";
import { FormCard } from "@/components/(admin)/forms/viewer/form-card";
import { AnimatePresence } from "framer-motion";
import { CreateFormDialog } from "@/components/(admin)/forms/dialogs/create-form-dialog";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getAllForms } from "@/server/actions/forms/get-all-forms";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";

export default function EvaluationsViewer() {
  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllForms({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  // TODO - add error handling
  // TODO - add loading skeleton
  if (isLoading) return <Loading />;
  if (!forms) return <div>No forms found</div>;

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
                <FormCard key={form.id} form={form} index={index} />
              ))}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}
