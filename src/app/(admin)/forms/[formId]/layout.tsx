"use client";
import { ReactNode, Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormValuesContext } from "@/providers/form-values-provider";
import FormEditorNav from "@/components/(admin)/forms/navs/form-editor-nav";
import { Section } from "@/components/ui/section";
import Loading from "@/components/ui/loading";
import { TabContent, TabsProvider } from "@/components/ui/animated-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FormResult } from "@/server/actions/forms/get-one-form";
import { trpc } from "@/app/_trpc/client";

export default function FormIdLayout({
  editor,
  responses,
  params,
}: {
  editor: ReactNode;
  responses: ReactNode;
  params: { formId: string };
}) {
  const formQuery = trpc.forms.byId.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    formId: params.formId,
  });

  const subcompetencyQuery = trpc.forms.subcompetencies.useSuspenseQuery({
    formId: params.formId,
  });

  const methods = useForm<FormResult>({
    defaultValues: formQuery[1].data,
  });

  if (!formQuery[1].data) throw new Error("No data found.");

  return (
    <TabsProvider>
      <FormProvider {...methods}>
        <FormValuesContext.Provider
          value={{
            form: formQuery[1].data,
            subcompetencies: subcompetencyQuery[1].data,
          }}
        >
          <FormEditorNav />
          <Section>
            <TabContent id="editor">
              <ScrollArea className="h-[650px] transition-all md:px-24 lg:px-64">
                {editor}
                <ScrollBar />
              </ScrollArea>
            </TabContent>
            <TabContent id="responses">{responses}</TabContent>
          </Section>
        </FormValuesContext.Provider>
      </FormProvider>
    </TabsProvider>
  );
}
