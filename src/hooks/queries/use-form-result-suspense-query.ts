"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";

export function useFormResultSuspenseQuery(formId: string) {
  const { data: formResult } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  return { formResult };
}
