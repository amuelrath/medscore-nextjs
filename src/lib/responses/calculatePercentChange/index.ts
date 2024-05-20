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

  const allEvaluateeResponses = formVersions.flatMap((v) =>
    v.responses?.find((r) => r.evaluatee.id === evaluateeId),
  );

  if (!allEvaluateeResponses || allEvaluateeResponses.length === 0) {
    return null;
  }

  const versions = formVersions.filter((v) =>
    allEvaluateeResponses.map((r) => r?.formVersionId).includes(v.id),
  );

  if (!versions || versions.length === 0) {
    throw new Error("Couldn't locate versions from their responses.");
  }

  const totals = versions
    .map((v) => {
      const responses = allEvaluateeResponses.filter(
        (r) => r?.formVersionId === v.id,
      );

      if (!responses || responses.length === 0) {
        return null;
      }

      const answers = responses.flatMap((a) => a?.answers);

      if (!answers || answers.length === 0) {
        return null;
      }

      let questions: QuestionVersionResult[] | undefined = v.questions;
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
        filteredAnswers = competencyAnswers!; // TODO this might break something
      }

      const { pointsEarned, pointsAvailable } =
        calculatePointsEarnedAndAvailable(questions, filteredAnswers);

      const percent = (pointsEarned || 0) / (pointsAvailable || 0);

      return {
        createdAt: new Date(v.createdAt),
        score: percent,
        versionId: v.id,
      };
    })
    .filter((total): total is PercentChangeData => total !== undefined);

  return calculatePercentChangeFromTotals(totals, currentVersionId);
}
