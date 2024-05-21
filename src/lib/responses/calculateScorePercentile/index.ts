import { FormVersionResult } from "@/db/types";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import { calculateCompetencyPercentages } from "@/lib/responses/calculateCompetencyPercentages";

/**
 * Calculates an evaluatee's score percentile compared to all other residents for a specific version.
 *
 * @param version - The form version containing questions and responses.
 * @param evaluateeId - The ID of the evaluatee for whom to calculate the score percentile.
 * @param competencyName - Optional competency name to filter the percentile calculation. If provided,
 *                         only the specified competency's score will be considered.
 * @returns The evaluatee's score percentile as a number between 0 and 100, or null if the percentile cannot be calculated.
 */
export function calculateScorePercentile(
  version: FormVersionResult,
  evaluateeId: string,
  competencyName?: string,
): number | null {
  const allResponses = version.responses;
  const evaluateeResponse = allResponses.find(
    (response) => response.evaluatee.id === evaluateeId,
  );

  if (!evaluateeResponse) {
    return null;
  }

  const allScores: number[] = allResponses.map((response) => {
    const answers = response.answers;

    if (competencyName) {
      const competencyPercentages = calculateCompetencyPercentages(
        version.questions,
        answers,
      );
      return competencyPercentages
        ? competencyPercentages[competencyName] || 0
        : 0;
    } else {
      const { pointsEarned, pointsAvailable } =
        calculatePointsEarnedAndAvailable(version.questions, answers);
      return (pointsAvailable || 0) > 0
        ? ((pointsEarned || 0) / (pointsAvailable || 0)) * 100
        : 0;
    }
  });

  const evaluateeScore = allScores[allResponses.indexOf(evaluateeResponse)];
  const lowerScores = allScores.filter((score) => score < evaluateeScore);

  return (lowerScores.length / (allScores.length - 1)) * 100;
}
