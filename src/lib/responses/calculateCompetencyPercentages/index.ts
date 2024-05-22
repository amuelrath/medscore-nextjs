import { AnswerResult, QuestionVersionResult } from "@/db/types";
import { COMPETENCIES } from "@/db/constants";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";

export function calculateCompetencyPercentages(
  questions: QuestionVersionResult[] | undefined,
  answers: AnswerResult[] | undefined,
) {
  if (!questions || !answers) return null;
  const competencyPercentages: Record<string, number> = {};

  for (const competencyName in COMPETENCIES) {
    const { filteredQuestions, filteredAnswers } =
      getFilteredQuestionsAndAnswers(
        competencyName as keyof typeof COMPETENCIES,
        questions,
        answers,
      );

    const { pointsEarned, pointsAvailable } = calculatePointsEarnedAndAvailable(
      filteredQuestions,
      filteredAnswers,
    );

    const percentage =
      pointsAvailable > 0 ? (pointsEarned / pointsAvailable) * 100 : 0;
    competencyPercentages[competencyName] = parseFloat(percentage.toFixed(2));
  }

  return competencyPercentages;
}
