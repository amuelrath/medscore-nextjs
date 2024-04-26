import { User } from "./schema";
import { InferResultType } from "./utils";
import { programs } from "./schema";

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
  { options: true; milestones: true }
>;

export type TSubcompetencyRelate = InferResultType<
  "subcompetencies",
  { competencies: true; milestones: true }
>;

export type TMilestoneRelate = InferResultType<
  "milestonesOnQuestions",
  {
    milestone: true;
  }
>;

export type TUserWithoutPassword = Omit<User, "password">;

export type TFormWithProgram = InferResultType<
  "forms",
  {
    programs: true;
  }
>;
