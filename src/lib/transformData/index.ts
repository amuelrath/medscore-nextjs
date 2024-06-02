import { FormVersionResult } from "@/db/types";

export function transformVersion(version: FormVersionResult): {
  questions: QuestionData[];
  answers: AnswerData[];
  milestones: MilestoneData[];
} {
  const questions: QuestionData[] = [];
  const answers: AnswerData[] = [];
  const milestones: MilestoneData[] = [];

  version.questions.forEach((questionData) => {
    const question: QuestionData = {
      id: questionData.id,
      text: questionData.text || "",
      feedback: questionData.feedback,
      position: questionData.position,
      options: questionData.options.map((optionData) => ({
        id: optionData.id,
        text: optionData.text || "",
        position: optionData.position,
        pointValue: parseInt(optionData.pointValue, 10),
      })),
      milestones: [],
    };

    questionData.milestones.forEach((milestoneData) => {
      const existingMilestone = milestones.find(
        (m) => m.id === milestoneData.milestone.id,
      );

      if (existingMilestone) {
        question.milestones.push(existingMilestone);
      } else {
        const milestone: MilestoneData = {
          id: milestoneData.milestone.id,
          name: milestoneData.milestone.name,
          subcompetencies: {
            id: milestoneData.milestone.subcompetencies.id,
            name: milestoneData.milestone.subcompetencies.name,
            competencyId:
              milestoneData.milestone.subcompetencies.competencies.id, // Access the competency ID from the nested competencies object
          },
        };

        milestones.push(milestone);
        question.milestones.push(milestone);
      }
    });

    questions.push(question);
  });

  version.responses.forEach((responseData) => {
    responseData.answers.forEach((answerData) => {
      const answer: AnswerData = {
        id: answerData.id,
        questionId: answerData.questionVersionId,
        optionId: answerData.optionVersionId || "",
        feedback: answerData.feedback || "",
      };

      answers.push(answer);
    });
  });

  return {
    questions,
    answers,
    milestones,
  };
}

// Entity types
export interface QuestionData {
  id: string;
  text: string;
  feedback?: boolean;
  position: number;
  options: OptionData[];
  milestones: MilestoneData[];
}

export interface OptionData {
  id: string;
  text: string;
  position: number;
  pointValue: number;
}

export interface AnswerData {
  id: string;
  questionId: string;
  optionId: string;
  feedback?: string;
}

export interface MilestoneData {
  id: string;
  name: string;
  subcompetencies: SubcompetencyData;
}

export interface SubcompetencyData {
  id: string;
  name: string;
  competencyId: string;
}
