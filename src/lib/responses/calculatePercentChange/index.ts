import { FormVersionsResult } from "@/server/actions/forms/get-all-versions";
import { COMPETENCIES } from "@/db/constants";
import { AnswerResult, QuestionVersionResult } from "@/db/types";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import {
  calculatePercentChangeFromTotals,
  PercentChangeData,
} from "@/lib/responses/calculatePercentChangeFromTotals";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
export function calculatePercentChange(
  evaluateeId: string,
  formVersions: FormVersionsResult,
  currentVersionId: string,
  competencyName?: keyof typeof COMPETENCIES,
) {
  if (!formVersions || !evaluateeId || !currentVersionId) return null;

  // Sort the form versions based on their createdAt date in ascending order
  const sortedVersions = formVersions.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );

  const currentVersionIndex = sortedVersions.findIndex(
    (v) => v.id === currentVersionId,
  );
  if (currentVersionIndex === -1) return null;

  const relevantVersions = sortedVersions.slice(0, currentVersionIndex + 1);

  const evaluateeResponses = relevantVersions
    .map((v) => v.responses?.find((r) => r.evaluatee.id === evaluateeId))
    .filter(
      (response): response is NonNullable<typeof response> =>
        response !== undefined,
    );

  if (evaluateeResponses.length === 0) {
    return null;
  }

  const totals = evaluateeResponses
    .map((response) => {
      const version = relevantVersions.find(
        (v) => v.id === response.formVersionId,
      );
      if (!version) return null;

      const answers = response.answers;
      if (!answers || answers.length === 0) {
        return null;
      }

      let questions: QuestionVersionResult[] | undefined = version.questions;
      let filteredAnswers: AnswerResult[] = answers.filter(
        (answer): answer is AnswerResult => answer !== undefined,
      );

      if (competencyName && answers) {
        const { filteredQuestions, filteredAnswers: competencyAnswers } =
          getFilteredQuestionsAndAnswers(
            competencyName,
            questions,
            filteredAnswers,
          );
        questions = filteredQuestions;
        filteredAnswers = competencyAnswers!;
      }

      const { pointsEarned, pointsAvailable } =
        calculatePointsEarnedAndAvailable(questions, filteredAnswers);

      const percent = (pointsEarned || 0) / (pointsAvailable || 0);

      return {
        createdAt: new Date(version.createdAt),
        score: percent,
        versionId: version.id,
      };
    })
    .filter((total): total is PercentChangeData => total !== null);

  return calculatePercentChangeFromTotals(totals);
}
