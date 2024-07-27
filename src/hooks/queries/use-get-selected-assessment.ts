import { useAtomValue } from "jotai/index";
import { selectedAssessmentIdAtom } from "@/store/form-atoms";
import { useQuery } from "@tanstack/react-query";
import { getAssessmentById } from "@/server/actions/responses/get-assessment";

export function useGetSelectedAssessment() {
  const selectedAssessmentId = useAtomValue(selectedAssessmentIdAtom);

  const {
    data: assessment,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ["assessment", selectedAssessmentId],
    queryFn: () => getAssessmentById(selectedAssessmentId!),
    enabled: !!selectedAssessmentId,
  });

  return { assessment, isLoading, ...rest };
}
