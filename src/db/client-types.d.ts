import { InferResultType } from "./utils";
import {
  Evaluation,
  questions,
  options,
  competencies,
  subcompetencies,
  milestones,
  evaluationVersions,
} from "./schema";

export type VersionedEvaluation = InferResultType<
  "forms",
  {
    programs: {
      with: {
        specialties: {
          with: {
            subcompetencies: {
              with: {
                milestones: true;
                competencies?: true;
              };
            };
          };
        };
      };
    };
    versions: true;
    questions: {
      with: {
        options: true;
        milestones: true;
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
  "milestones",
  { subcompetencies: { with: { competencies: true } } }
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
