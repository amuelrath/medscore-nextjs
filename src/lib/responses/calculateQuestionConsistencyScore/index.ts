import { FormVersionResult } from "@/server/actions/forms/get-one-version";
import { QuestionVersionResult } from "@/db/types";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";

/**
 * Calculates the percentage of evaluatees who performed consistently well or poorly on a specific question.
 *
 * @param formVersions - An array of form versions containing responses and questions.
 * @param evaluateeIds - An array of evaluatee IDs to consider in the calculation.
 * @param questionId - The ID of the question for which to calculate the consistency score.
 * @param goodThreshold - The percentage threshold above which a score is considered good.
 * @param badThreshold - The percentage threshold below which a score is considered bad.
 * @returns An object containing the percentage of evaluatees who performed consistently well (consistentlyGoodPercentage)
 *          and the percentage of evaluatees who performed consistently poorly (consistentlyBadPercentage) on the specified question.
 */
export function getQuestionConsistencyScore(
  formVersions: FormVersionResult[],
  evaluateeIds: string[],
  questionId: string,
  goodThreshold: number,
  badThreshold: number,
): {
  consistentlyGoodPercentage: number;
  consistentlyBadPercentage: number;
} {
  const latestVersion = formVersions.reduce((latest, version) =>
    version.createdAt > latest.createdAt ? version : latest,
  );

  const questionScores = evaluateeIds.map((evaluateeId) => {
    const response = latestVersion.responses?.find(
      (r) => r.evaluatee.id === evaluateeId,
    );
    const answer = response?.answers.find(
      (a) => a.questionVersionId === questionId,
    );

    if (!answer) return 0;

    const question: QuestionVersionResult | undefined =
      latestVersion.questions?.find((q) => q.id === questionId);
    if (!question) return null;

    const { pointsEarned, pointsAvailable } = calculatePointsEarnedAndAvailable(
      [question],
      [answer],
    );
    return (pointsAvailable || 0) > 0
      ? (pointsEarned || 0) / (pointsAvailable || 0)
      : 0;
  });

  if (!questionScores) throw new Error("questionScores is not defined.");

  const consistentlyGoodCount = questionScores.filter(
    (score) => (score || 0) >= goodThreshold,
  ).length;
  const consistentlyBadCount = questionScores.filter(
    (score) => (score || 0) <= badThreshold,
  ).length;

  const consistentlyGoodPercentage =
    (consistentlyGoodCount / questionScores.length) * 100;
  const consistentlyBadPercentage =
    (consistentlyBadCount / questionScores.length) * 100;

  return {
    consistentlyGoodPercentage,
    consistentlyBadPercentage,
  };
}
