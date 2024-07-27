"use client";

import { useFormContext } from "react-hook-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";

export function useFormResultInEditor() {
  const { getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);
  const { data: formResult, isLoading, ...rest } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  return { formResult, isLoading, ...rest };
}
