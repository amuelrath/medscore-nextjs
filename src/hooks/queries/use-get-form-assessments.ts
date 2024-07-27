import {  useSuspenseQuery } from "@tanstack/react-query";
import { getAllAssessmentsForForm } from "@/server/actions/responses/get-all-assessments-for-form";
import { useFormContext } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";

export function useGetFormAssessments() {
  const { getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);

  const {
    data: assessments,
    isLoading,
    ...rest
  } = useSuspenseQuery({
    queryKey: ["assessments", formId],
    queryFn: () => getAllAssessmentsForForm(formId!),
  });

  return {   assessments, isLoading, formId, ...rest };
}
