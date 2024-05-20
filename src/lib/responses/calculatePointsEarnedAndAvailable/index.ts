import { AnswerResult, QuestionVersionResult } from "@/db/types";

/**
 * Calculates the points earned and points available for a set of questions and answers.
 *
 * @param questions - An array of questions with their options and point values.
 * @param answers - An array of answers corresponding to the questions.
 * @returns An object containing the total points earned (pointsEarned) and total points available (pointsAvailable).
 */
export function calculatePointsEarnedAndAvailable(
  questions: QuestionVersionResult[] | undefined,
  answers: AnswerResult[] | undefined,
): { pointsEarned: number; pointsAvailable: number } {
  const pointsAvailable =
    questions?.reduce((total, question) => {
      const highestPointValue = question.options
        ? Math.max(
            ...question.options.map((option) => Number(option.pointValue) || 0),
          )
        : 0;
      return total + highestPointValue;
    }, 0) || 0;

  const pointsEarned =
    answers?.reduce((total, answer) => {
      const question = questions?.find(
        (q) => q.id === answer.questionVersionId,
      );
      const selectedOption = question?.options?.find(
        (o) => o.id === answer.optionVersionId,
      );
      return total + (selectedOption ? Number(selectedOption.pointValue) : 0);
    }, 0) || 0;

  return { pointsEarned, pointsAvailable };
}
