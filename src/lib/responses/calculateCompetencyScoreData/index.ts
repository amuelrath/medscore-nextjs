import { FormVersionsResult } from "@/db/types";
import { getFilteredQuestionsAndAnswers } from "../utils";
import { COMPETENCIES } from "@/db/constants";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";

export interface CompetencyScoreData {
  pointsEarned: number | undefined;
  pointsAvailable: number | undefined;
  versionCreatedAt: Date;
}

/**
 * Retrieves competency score data for a specific evaluatee and competency across form versions.
 *
 * @param currentFormVersionId - The ID of the current form version.
 * @param evaluateeId - The ID of the evaluatee.
 * @param competencyName - The name of the competency.
 * @param versions - The array of form versions.
 * @param all - Optional flag to include all form versions. Default is false.
 * @returns An array of CompetencyScoreData objects or undefined if versions or evaluateeId is not provided.
 */
export function calculateCompetencyScoreData(
  currentFormVersionId: string,
  evaluateeId: string,
  competencyName: keyof typeof COMPETENCIES,
  versions: FormVersionsResult | undefined,
  all?: boolean,
): CompetencyScoreData[] | undefined {
  let result: CompetencyScoreData[] | undefined = [];
  let relevantFormVersions: FormVersionsResult;
  if (!versions || !evaluateeId) return undefined;
  const evaluateeIsEvaluated = () => {
    let responses = versions.flatMap((v) => v.responses);
    if (!responses)
      throw new Error("No responses could be found for a version.");
    return Boolean(responses.find((r) => r.evaluatee.id === evaluateeId));
  };
  if (!evaluateeIsEvaluated()) throw new Error("Evaluatee is not evaluated!");
  // Find the current form version
  const currentFormVersion = versions.find(
    (version) => version.id === currentFormVersionId,
  );

  if (!currentFormVersion) {
    throw new Error("Current form version not found!");
  }

  // Filter form versions based on the createdAt timestamp of the current version
  if (!all) {
    relevantFormVersions = versions.filter(
      (version) =>
        new Date(version.createdAt) <= new Date(currentFormVersion.createdAt),
    );
  } else {
    relevantFormVersions = versions;
  }

  // Process each form version and calculate the competency score data
  relevantFormVersions
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((version) => {
      const response = version.responses?.find(
        (r) => r.evaluatee.id === evaluateeId,
      );
      const answers = response?.answers;
      const questions = version.questions;

      const { filteredQuestions, filteredAnswers } =
        getFilteredQuestionsAndAnswers(competencyName, questions, answers);

      const { pointsEarned, pointsAvailable } =
        calculatePointsEarnedAndAvailable(filteredQuestions, filteredAnswers);

      result?.push({
        pointsEarned,
        pointsAvailable,
        versionCreatedAt: new Date(version.createdAt),
      });
    });

  return result;
}
