import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useFormSuspenseQuery({ formId }: { formId: string }) {
  const { data: form } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({
        formId,
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID as string,
      }),
  });

  return { form };
}

