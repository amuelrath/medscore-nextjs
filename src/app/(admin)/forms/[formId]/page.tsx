"use client";
import FormEditorSection from "@/components/(admin)/forms/editor";
import { trpc } from "@/app/_trpc/client";
export default function EditorPage({ params }: { params: { formId: string } }) {
  const utils = trpc.useUtils();
  const formQuery = trpc.forms.byId.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    formId: params.formId,
  });

  if (!formQuery[1]) {
    return new Error("Form not found");
  }

  const subcompetencyQuery = trpc.forms.subcompetencies.useSuspenseQuery({
    formId: params.formId,
  });

  // prefetch the responses page!
  // TODO I'm not sure if this implementation is correct.
  utils.forms.status.prefetch({ formId: params.formId });

  if (!formQuery[1].data) throw new Error("No data found.");
  if (formQuery[1].data?.creatorId !== process.env.NEXT_PUBLIC_DEV_USER_ID!) {
    return new Error("Unauthorized");
  }

  return (
    <FormEditorSection
      form={formQuery[1].data}
      subcompetencies={subcompetencyQuery[1].data}
    />
  );
}
