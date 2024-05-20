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
    const pointsData = calculatePointsEarnedAndAvailable(
      filteredQuestions,
      filteredAnswers,
    );

    const pointsEarned = pointsData?.pointsEarned ?? 0;
    const pointsAvailable = pointsData?.pointsAvailable ?? 0;

    competencyPercentages[competencyName] =
      pointsAvailable > 0 ? (pointsEarned / pointsAvailable) * 100 : 0;
  }
  return competencyPercentages;
}
