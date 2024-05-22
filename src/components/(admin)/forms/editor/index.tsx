"use client";
import { FormResult, TSubcompetencyRelate } from "@/db/types";
import { FormProvider, useForm } from "react-hook-form";
import QuestionCards from "@/components/(admin)/forms/editor/questions";
import { Section } from "@/components/ui/section";
import { TabContent, TabsProvider } from "@/components/ui/animated-tabs";
import ResponsesSection from "@/components/(admin)/forms/responses";
import { FormValuesContext } from "@/providers/form-values-provider";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import FormEditorNav from "@/components/(admin)/forms/navs/form-editor-nav";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Editor({
  form,
  subcompetencies,
}: {
  form: FormResult;
  subcompetencies: TSubcompetencyRelate[];
}) {
  const methods = useForm<FormResult>({
    defaultValues: form,
  });

  return (
    <TabsProvider>
      <FormProvider {...methods}>
        <FormValuesContext.Provider value={{ form, subcompetencies }}>
          <FormEditorNav />
          <Section>
            <Suspense fallback={<Loading />}>
              <TabContent id="editor">
                <ScrollArea className="h-[650px] transition-all md:px-24 lg:px-64">
                  <ScrollBar />
                  <QuestionCards/>
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
