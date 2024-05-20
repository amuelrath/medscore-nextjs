import { COMPETENCIES } from "@/db/constants";
import { AnswerResult, QuestionVersionResult } from "@/db/types";

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
  questions: QuestionVersionResult[] | undefined,
  answers: AnswerResult[] | undefined,
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
