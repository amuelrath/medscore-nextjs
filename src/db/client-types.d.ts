import { InferResultType } from "./utils";
import { Evaluation, Question, Option } from "./schema";

export type ClientEvaluation = InferResultType<
  "evaluations",
  { questions: { with: { options: true; milestones: true } } }
>;

export type ClientQuestion = InferResultType<
  "questions",
  { options: true; milestones: true }
>;
