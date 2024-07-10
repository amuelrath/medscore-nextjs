"use client";

import { useFormContext } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { useQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";

export function useFormResultInEditorQuery() {
  const { getValues } = useFormContext<TFormRelate>();
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
