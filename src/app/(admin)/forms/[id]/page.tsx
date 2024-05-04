"use client";
import FormEditorSection from "@/components/(admin)/forms/editor";
import { trpc } from "@/app/_trpc/client";
import { TFormRelate } from "@/db/types";
export default function EditorPage({ params }: { params: { id: string } }) {
  const utils = trpc.useUtils();
  const formQuery = trpc.forms.byId.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    formId: params.id,
  });

  if (!formQuery[1]) {
    return new Error("Form not found");
  }

  const subcompetencyQuery = trpc.forms.subcompetencies.useSuspenseQuery({
    formId: params.id,
  });

  // prefetch the responses page!
  // TODO I'm not sure if this implementation is correct.
  utils.forms.status
    .prefetch({ formId: params.id })
    .then(() => console.log("Prefetched Form!"));

  // update last opened

  if (formQuery[1].data?.creatorId !== process.env.NEXT_PUBLIC_DEV_USER_ID!) {
    return new Error("Unauthorized");
  }

  return (
    <FormEditorSection
      form={formQuery[1].data as unknown as TFormRelate}
      subcompetencies={subcompetencyQuery[1].data}
    />
  );
}
