import { InferResultType } from "./utils";
import { Answer } from "@/db/schema";

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
        milestones: {
          with: { milestone: true };
        };
      };
    };
  }
>;
export type TQuestionRelate = InferResultType<
  "questions",
  { options: true; milestones: { with: { milestone: true } } }
>;

export type TSubcompetencyRelate = InferResultType<
  "subcompetencies",
  { competencies: true; milestones: true }
>;

export type TEvaluationForm = InferResultType<
  "formVersions",
  {
    questions: {
      with: {
        options: true;
        milestones: {
          with: {
            milestone: true;
          };
        };
      };
    };
  }
>;

export type TResponseRelate = InferResultType<
  "responses",
  {
    answers: {
      with: {
        questionVersions: {
          with: {
            formVersion: true;
          };
        };
      };
    };
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

export interface ResponseColumn {
  id: string;
  evaluateeFullName: string;
  creatorFullName: string;
  formName: string;
  formProgramName: string;
  createdAt: string | Date;
  deletedAt: string | Date | null;
}
