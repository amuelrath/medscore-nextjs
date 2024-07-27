import { useQuery } from "@tanstack/react-query";
import {
  getResponseCompetencyScoresOverTime
} from "@/server/actions/responses/get-response-competency-scores-over-time";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useAtomValue } from "jotai";

export function useGetResponseCompetencyScores() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom)
  const {
    data: responseCompetencyScores,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ["response", selectedResponseId, "competencies"],
    queryFn: () => getResponseCompetencyScoresOverTime(selectedResponseId!),
    enabled: !!selectedResponseId,
    staleTime: 1000 * 60 * 10 // 10 min
  });

  return { responseCompetencyScores, isLoading, ...rest}
}