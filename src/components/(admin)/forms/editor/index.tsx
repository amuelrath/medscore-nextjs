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
        <FormEditorNav />
        <Section>
          <Suspense fallback={<Loading />}>
            <TabContent id="editor">
              <div className="pb-[16rem] pt-4 md:px-24 lg:px-64 transition-all">
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
