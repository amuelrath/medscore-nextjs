import { ReactNode } from "react";
import { FormContextWrapper } from "@/components/(admin)/forms/editor/form-context-wrapper";
import { fetchFormData } from "@/fetchers/form-data-fetcher";
import { FormLayout } from "@/components/(admin)/forms/form-layout";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function FormIdLayout({
  editor,
  responses,
  params,
}: {
  editor: ReactNode;
  responses: ReactNode;
  params: { formId: string };
}) {
  const { form, queryClient } = await fetchFormData(params.formId);

  if (!form)
    throw new Error("Error fetching this form! Please try again momentarily.");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormContextWrapper defaultValues={form}>
        <FormLayout editor={editor} responses={responses} />
      </FormContextWrapper>
    </HydrationBoundary>
  );
}
