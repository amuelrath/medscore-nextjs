import { InferResultType } from "./utils";
import {
  Evaluation,
  questions,
  options,
  competencies,
  subcompetencies,
  milestones,
} from "./schema";

export type Allocation = {
  milestoneId: string;
};

export type ClientForm = InferResultType<
  "forms",
  {
    programs: {
      with: {
        specialties: true;
      };
    };
    questions: {
      with: {
        milestones: {
          columns: {
            milestoneId: true;
            questionId: false;
            version: false;
            deletedAt: false;
          };
        };
        options: true;
      };
    };
  }
>;

export type ClientQuestion = InferResultType<
  "questions",
  { options: true; milestones: true }
>;

export type ClientSubcompetency = InferResultType<
  "subcompetencies",
  { competencies: true; milestones: true }
>;

export type ClientMilestone = InferResultType<
  "milestonesOnQuestions",
  {
    milestone: true;
  }
>;

export type EvaluationFormData = {
  id: string;
  title: string;
  programId: string;
  questions: {
    id: string;
    position: number;
    text: string;
    feedback: boolean;
    milestoneIds: string[];
    options: {
      id: string;
      position: number;
      text: string;
      pointValue: number;
    }[];
  }[];
};

export type EvaluationWithProgram = InferResultType<
  "evaluations",
  {
    programs: true;
    publications: true;
  }
>;
