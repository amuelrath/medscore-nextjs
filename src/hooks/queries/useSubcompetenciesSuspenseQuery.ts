import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSubcompetenciesSuspenseQuery({ formId }: { formId: string }) {
  const { data: subcompetencies } = useSuspenseQuery({
    queryKey: ["subcompetencies", formId],
    queryFn: () =>
      getSubcompetencies({
        formId,
      }),
  });

  return { subcompetencies };
}