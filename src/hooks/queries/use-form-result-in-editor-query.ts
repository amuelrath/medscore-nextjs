"use client";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";

export function useFormResultInEditorQuery() {
  const { getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);
  const {
    data: formResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  return { formResult, isLoading, error };
}
