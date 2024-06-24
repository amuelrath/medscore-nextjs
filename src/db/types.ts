import {  InferResultType } from "./utils";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
export type { FormResult };

export type TFormRelate = InferResultType<
  "forms",
  {
    programs: {
      with: {
        users: {
          with: {
            user: true;
          };
        };
      };
    };
    questions: {
      with: {
        options: true;
        recommendedMilestone: true;
        milestones: {
          with: { milestone: true };
        };
      };
    };
  }
>;

export type TQuestionRelate = InferResultType<
  "questions",
  {
    options: true;
    recommendedMilestone: true;
    milestones: {
      with: {
        milestone: {
          with: { subcompetencies: { with: { competencies: true } } };
        };
      };
    };
  }
>;

export type TSubcompetencyRelate = InferResultType<
  "subcompetencies",
  { competencies: true; milestones: true }
>;


export type TResponse = InferResultType<
  "responses",
  {
    answers: true;
    creator: true;
    evaluatee: true;
  }
>;

export interface TResponseSchema {
  creatorId: string;
  evaluateeId: string;
  formVersionId: string;
  answers: {
    questionVersionId: string;
    optionVersionId?: string;
    feedback: string | undefined;
  }[];
}

