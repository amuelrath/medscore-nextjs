import { ReactNode } from "react";
import {
  DirectionAwareContent,
  DirectionAwareTabsProvider,
} from "@/components/ui/direction-aware-tabs";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import FormEditorNav from "@/components/(admin)/forms/navs/form-editor-nav";
import { EditorFormProvider } from "@/components/(admin)/forms/providers/editor-form-provider";
import { Section } from "@/components/ui/section";


export default async function FormIdLayout({
  editor,
  responses,
  params,
}: {
  editor: ReactNode;
  responses: ReactNode;
  params: { formId: string };
}) {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 3 minutes
      },
    },
  });

  // Fetch form and subcompetencies data
  const [form] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["form", params.formId],
      queryFn: () =>
        getFormById({
          formId: params.formId,
          userId: process.env.NEXT_PUBLIC_DEV_USER_ID as string,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["subcompetencies", params.formId],
      queryFn: () => getSubcompetencies({ formId: params.formId }),
      staleTime: 1000 * 60 * 60 * 24, // 1 day
    }),
  ]);

  const tabs = [
    {
      id: 0,
      label: "Editor",
      content: <Section>{editor}</Section>,
    },
    {
      id: 1,
      label: "Responses",
      content: <>{responses}</>,
    },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DirectionAwareTabsProvider tabs={tabs}>
        <EditorFormProvider defaultValues={form}>
          <FormEditorNav />
          <DirectionAwareContent />
        </EditorFormProvider>
      </DirectionAwareTabsProvider>
    </HydrationBoundary>
  );
}
