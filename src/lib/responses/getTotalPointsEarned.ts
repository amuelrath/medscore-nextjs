import { TQuestionRelate } from "@/db/types";
import { Answer } from "@/db/schema";

export const getTotalPointsEarned = (
  questions: TQuestionRelate[],
  answers: Answer[] | undefined,
) => {
  if (!questions || !answers) return null;

  const pointsAvailable = questions.reduce((total, question) => {
    const highestPointValue = Math.max(
      ...(question.options || []).map((option) => Number(option.pointValue)),
    );
    return total + highestPointValue;
  }, 0);

  const pointsEarned = answers.reduce((total, answer) => {
    const question = questions.find((q) => q.id === answer.questionVersionId);
    const selectedOption = question?.options?.find(
      (o) => o.id === answer.optionVersionId,
    );
    return total + (selectedOption ? Number(selectedOption.pointValue) : 0);
  }, 0);

  return { pointsEarned, pointsAvailable };
};
