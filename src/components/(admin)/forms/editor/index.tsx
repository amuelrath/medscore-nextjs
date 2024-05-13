"use client";
import { TFormRelate, TSubcompetencyRelate } from "@/db/types";
import { v4 } from "uuid";
import { FormProvider, useForm } from "react-hook-form";
import QuestionCards from "@/components/(admin)/forms/editor/questions";
import { Section } from "@/components/ui/section";
import { TabContent, TabsProvider } from "@/components/ui/animated-tabs";
import ResponsesSection from "@/components/(admin)/forms/responses";
import { FormValuesContext } from "@/providers/form-values-provider";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import FormEditorNav from "@/components/(admin)/forms/navs/form-editor-nav";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Scrollbar} from "@radix-ui/react-scroll-area";

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

  return (
    <TabsProvider>
      <FormProvider {...methods}>
        <FormValuesContext.Provider value={{ form }}>
          <FormEditorNav />
          <Section>
            <Suspense fallback={<Loading />}>
              <TabContent id="editor">
                <ScrollArea className="h-[570px] pt-4 transition-all md:px-24 lg:px-64">
                  <Scrollbar />
                  <QuestionCards subcompetencies={subcompetencies || []} />
                </ScrollArea>
              </TabContent>
              <TabContent id="responses">
                <ResponsesSection />
              </TabContent>
            </Suspense>
          </Section>
        </FormValuesContext.Provider>
      </FormProvider>
    </TabsProvider>
  );
}
