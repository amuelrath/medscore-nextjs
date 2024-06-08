import { DateToString, InferResultType } from "./utils";
import { FormVersionsResult } from "@/server/actions/forms/get-all-versions";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { FormVersionResult } from "@/server/actions/forms/get-one-version";
export type { FormVersionsResult, FormResult, FormVersionResult };

export type ResponseResult = NonNullable<
  DateToString<
    Omit<
      InferResultType<
        "responses",
        {
          answers: {
            columns: {
              id: true;
              optionVersionId: true;
              questionVersionId: true;
              createdAt: false;
              updatedAt: false;
              deletedAt: false;
              responseId: false;
              feedback: true;
            };
          };
          creator: {
            columns: { email: false; password: false };
          };
          evaluatee: {
            columns: { email: false; password: false };
          };
        }
      >,
      "updatedAt" | "deletedAt" | "creatorId" | "evaluateeId"
    >
  >
>;

export type AnswerResult = NonNullable<
  DateToString<
    Omit<
      InferResultType<"answers">,
      "createdAt" | "deletedAt" | "updatedAt" | "responseId"
    >
  >
>;
export type QuestionVersionResult = Omit<
  InferResultType<
    "questionVersions",
    {
      options: {
        columns: { questionVersionId: false };
      };
      milestones: {
        columns: { questionVersionId: false; milestoneId: false };
        with: {
          milestone: {
            columns: { sublevel: false; level: false; subcompetencyId: false };
            with: {
              subcompetencies: {
                columns: {
                  level: false;
                  specialtyId: false;
                  competencyId: false;
                };
                with: {
                  competencies: true;
                };
              };
            };
          };
        };
      };
    }
  >,
  "formVersionId"
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

export type AiInsightData = {
  exam: {
    type: "Objective Structured Clinical Exam" | "Survey";
    specialty: string;
    title: string;
    administeredAt: string;
    evaluatee: {
      name: string;
      role: "Medical Resident" | "Medical Fellow";
    };
    overallPerformance: {
      averageScore: number;
      percentileRank: number;
      questionsAboveAverage: number;
      questionsBelowAverage: number;
    };
    domains: {
      name:
        | "Patient Care"
        | "Medical Knowledge"
        | "Professionalism"
        | "Systems-Based Practice"
        | "Practice-Based Learning and Improvement"
        | "Interpersonal and Communication Skills";
      percentChangeFromPreviousAttempt: number;
      percentChangeFromFirstAttempt: number;
      timeVersusScoreCorrelationCoefficient: number;
      questionsFromExam: {
        questionText: string;
        allocatedAcgmeMilestoneDescription: string;
        percentScore: number;
        averageScore: number;
        percentileRank: number;
        evaluatorFeedback: string;
      }[];
    }[];
  };
};
