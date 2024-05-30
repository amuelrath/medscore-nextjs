import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import { useCompetencyScores } from "../use-competency-scores";

export function useFormScores() {
  const { versions } = useAllFormVersions();
  const { selectedVersion, selectedResponse } = useSelectedContext();

  //  we can also aggregate the data by using 'selectedVersion.responses.flatMap((r) => r.answers)'
  //  will return the total points earned for this version, then we can multiply the points available by
  //  the number of responses to get the average score on the exam
  const score = calculatePointsEarnedAndAvailable(
    selectedVersion?.questions || [],
    selectedResponse?.answers || [],
  );

  const percentages = calculatePercentChange(
    selectedResponse?.evaluatee.id || "",
    versions,
    selectedVersion?.id || "",
  );

  const { percentages: competencyPercentages, scores: competencyScores } =
    useCompetencyScores();

  return { score, percentages, competencyScores, competencyPercentages };
}
