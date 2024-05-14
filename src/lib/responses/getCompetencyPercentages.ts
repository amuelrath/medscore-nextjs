import { TQuestionRelate } from "@/db/types";
import { Answer } from "@/db/schema";
import { COMPETENCIES } from "@/db/constants";

export const getCompetencyPercentages = (
  questions: TQuestionRelate[],
  answers: Answer[] | undefined,
) => {
  if (!questions || !answers) return null;

  const competencyPointsAvailable = Object.values(COMPETENCIES).reduce(
    (acc, c) => ({ ...acc, [c.id]: 0 }),
    {} as Record<string, number>,
  );

  questions.forEach((question) => {
    const competencyIdsOnThisQuestion = question.milestones.map(
      (m) => m.milestone.subcompetencies.competencies.id,
    );
    const highestPointValue = Math.max(
      ...(question.options || []).map((option) => Number(option.pointValue)),
    );
    competencyIdsOnThisQuestion.forEach(
      (id) => (competencyPointsAvailable[id] += highestPointValue),
    );
  });

  const competencyPointsEarned = Object.values(COMPETENCIES).reduce(
    (acc, c) => ({ ...acc, [c.id]: 0 }),
    {} as Record<string, number>,
  );

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionVersionId);
    if (!question) return;

    const competencyIdsOnThisQuestion = question.milestones.map(
      (m) => m.milestone.subcompetencies.competencies.id,
    );
    const selectedOption = question.options?.find(
      (o) => o.id === answer.optionVersionId,
    );
    const pointsEarned = selectedOption ? Number(selectedOption.pointValue) : 0;
    competencyIdsOnThisQuestion.forEach(
      (id) => (competencyPointsEarned[id] += pointsEarned),
    );
  });

  return Object.keys(competencyPointsAvailable).reduce(
    (acc, id) => ({
      ...acc,
      [id]:
        competencyPointsAvailable[id] > 0
          ? (competencyPointsEarned[id] / competencyPointsAvailable[id]) * 100
          : 0,
    }),
    {} as Record<string, number>,
  );
};
