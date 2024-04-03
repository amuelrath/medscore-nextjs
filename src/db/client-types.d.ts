import { InferResultType } from "./utils";
import {
  Evaluation,
  questions,
  options,
  competencies,
  subcompetencies,
  milestones,
} from "./schema";

export type ClientEvaluation = InferResultType<
  "evaluations",
  {
    programs: {
      with: {
        specialties: {
          with: {
            subcompetencies: {
              with: {
                competencies: true;
                milestones: {
                  with: { subcompetencies: { with: { competencies: true } } };
                };
              };
            };
          };
        };
      };
    };
    questions: {
      with: {
        milestones: true;
        options: true;
      };
    };
  }
>;

export type ClientQuestion = InferResultType<
  "questions",
  { options: true; milestones: true }
>;

export type ClientMilestone = InferResultType<
  "milestones",
  { subcompetencies: { with: { competencies: true } } }
>;
