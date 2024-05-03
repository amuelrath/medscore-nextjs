"use client";
import { TFormRelate, TSubcompetencyRelate } from "@/db/types";
import { v4 } from "uuid";
import { cn } from "@/lib/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";
import QuestionCards from "@/components/(evaluations)/editor/questions";
import SaveFormButton from "@/components/(evaluations)/editor/save-form-button";
import { Section } from "@/components/ui/section";
import LoadingSection from "./loading-section";
import {
  AnimatedTabs,
  TabContent,
  TabsProvider,
} from "@/components/ui/animated-tabs";
import ResponsesSection from "@/components/(evaluations)/sections/form-responses";
import { FormValuesContext } from "@/providers/form-values-provider";
import { Suspense } from "react";
import { saveForm } from "@/server/actions/forms/save-form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "editor", label: "Editor" },
  { id: "responses", label: "Responses" },
];

export default function Editor({
  form,
  subcompetencies,
}: {
  form: TFormRelate;
  subcompetencies: TSubcompetencyRelate[];
}) {
  const methods = useForm<TFormRelate>({
    defaultValues: form || {
      form: {
        id: v4(),
        title: "Untitled Evaluation",
        programId: "",
        questions: [
          {
            id: v4(),
            text: "",
            options: [
              { id: v4(), text: "" },
              { id: v4(), text: "" },
            ],
          },
        ],
      },
    },
  });

  const handleSave = () => {
    saveForm(methods.getValues());
  };

  return (
    <TabsProvider>
      <FormProvider {...methods}>
        <div className="h-18 sticky top-[57px] z-40 flex flex-row items-center space-x-2 border-b bg-background p-2 px-8 shadow-sm">
          <div className={cn("cursor-default")}>
            <Controller
              name={"title"}
              control={methods.control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={cn("bg-inherit text-xl font-semibold")}
                />
              )}
            />
          </div>

          <div className={cn("flex items-center space-x-2")}>
            <AnimatedTabs tabs={tabs} size={"xs"} />
            <div onClick={() => handleSave}>
              <SaveFormButton />
            </div>
          </div>
        </div>
        <Section>
          <Suspense fallback={<LoadingSection />}>
            <TabContent id="editor">
              <div className="pb-[16rem] pt-4">
                <QuestionCards subcompetencies={subcompetencies || []} />
              </div>
            </TabContent>
            <TabContent id="responses">
              <FormValuesContext.Provider value={{ form }}>
                <ResponsesSection />
              </FormValuesContext.Provider>
            </TabContent>
          </Suspense>
        </Section>
      </FormProvider>
    </TabsProvider>
  );
}
