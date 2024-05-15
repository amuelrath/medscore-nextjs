import { TQuestionRelate } from "@/db/types";
import { Answer } from "@/db/schema";
import { COMPETENCIES } from "@/db/constants";

/**
 * Calculates the points earned and points available for a set of questions and answers.
 *
 * @param questions - An array of questions with their options and point values.
 * @param answers - An array of answers corresponding to the questions.
 * @returns An object containing the total points earned (pointsEarned) and total points available (pointsAvailable).
 */
export function getPointsEarnedAndAvailable(
  questions: TQuestionRelate[] | undefined,
  answers: Answer[] | undefined,
) {
  const pointsAvailable = questions?.reduce((total, question) => {
    const highestPointValue = Math.max(
      ...(question.options || []).map((option) => Number(option.pointValue)),
    );
    return total + highestPointValue;
  }, 0);

  const pointsEarned = answers?.reduce((total, answer) => {
    const question = questions?.find((q) => q.id === answer.questionVersionId);
    const selectedOption = question?.options?.find(
      (o) => o.id === answer.optionVersionId,
    );
    return total + (selectedOption ? Number(selectedOption.pointValue) : 0);
  }, 0);

  return { pointsEarned, pointsAvailable };
}

/**
 * Filters questions and answers based on a specific competency.
 *
 * @param competencyName - The name of the competency to filter by.
 * @param questions - An array of questions with their associated milestones and competencies.
 * @param answers - An array of answers corresponding to the questions.
 * @returns An object containing the filtered questions (filteredQuestions) and filtered answers (filteredAnswers)
 *          that belong to the specified competency.
 */
export function getFilteredQuestionsAndAnswers(
  competencyName: keyof typeof COMPETENCIES,
  questions: TQuestionRelate[] | undefined,
  answers: Answer[] | undefined,
) {
  const filteredQuestions = questions?.filter((question) =>
    question.milestones?.some(
      (m) => m.milestone.subcompetencies.competencies.name === competencyName,
    ),
  );

  const filteredAnswers = answers?.filter((answer) =>
    filteredQuestions?.some((q) => q.id === answer.questionVersionId),
  );

  return { filteredQuestions, filteredAnswers };
}
