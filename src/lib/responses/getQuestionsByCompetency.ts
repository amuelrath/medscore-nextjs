import { COMPETENCIES } from "@/db/constants";
import { TQuestionRelate } from "@/db/types";
import { Answer } from "@/db/schema";

export const getQuestionsByCompetency = (
  competencyName: keyof typeof COMPETENCIES,
  questions: TQuestionRelate[],
  answers: Answer[] | undefined,
) => {
  const competencyQuestions: {
    questions: TQuestionRelate[];
    answers: Answer[];
  } = {
    questions: [],
    answers: [],
  };

  questions.forEach((question) => {
    const allMilestonesOnThisQuestion = question.milestones.map(
      (m) => m.milestone,
    );
    const competencyNamesOnThisQuestion = allMilestonesOnThisQuestion.map(
      (m) => m.subcompetencies.competencies.name,
    );

    if (competencyNamesOnThisQuestion.includes(competencyName)) {
      competencyQuestions.questions.push(question);

      const questionAnswers =
        answers?.filter((answer) => answer.questionVersionId === question.id) ||
        [];
      competencyQuestions.answers.push(...questionAnswers);
    }
  });

  return competencyQuestions;
};
