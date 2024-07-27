import { useFormContext } from "react-hook-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";

export function useGetSubcompetenciesInEditor() {
  const { getValues } = useFormContext();
  const formId = getValues(`id`);
  const { data: subcompetencies, isLoading, isError, ...rest } = useSuspenseQuery({
    queryKey: ["subcompetencies", formId],
    queryFn: () => getSubcompetencies({ formId }),
    staleTime: 1000 * 60 * 60 * 999 // 999 h

  });

  return { subcompetencies, isLoading, isError, ...rest}
}