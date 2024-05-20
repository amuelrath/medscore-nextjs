import { DateToString, InferResultType } from "./utils";
import { FormVersionsResult } from "@/server/actions/forms/get-all-versions";
import { FormResult } from "@/server/actions/forms/get-one-form";
import { FormVersionResult } from "@/server/actions/forms/get-one-version";
export type { FormVersionsResult, FormResult, FormVersionResult };

export type ResponseResult = NonNullable<
  DateToString<
    InferResultType<
      "responses",
      { answers: true; creator: true; evaluatee: true }
    >
  >
>;

export type AnswerResult = NonNullable<
  DateToString<InferResultType<"answers">>
>;
export type QuestionVersionResult = InferResultType<
  "questionVersions",
  {
    options: true;
    milestones: {
      with: {
        milestone: {
          with: {
            subcompetencies: {
              with: {
                competencies: true;
              };
            };
          };
        };
      };
    };
  }
>;
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
  {
    options: true;
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

export type TFormVersion = InferResultType<
  "formVersions",
  {
    questions: {
      with: {
        options: true;
        milestones: {
          with: {
            milestone: {
              with: {
                subcompetencies: {
                  with: {
                    competencies: true;
                  };
                };
              };
            };
          };
        };
      };
    };
    responses: {
      with: {
        answers: true;
        creator: true;
        evaluatee: true;
      };
    };
    code: true;
  }
>;
