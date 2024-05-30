import z from "zod";

const ZAiSummarizeCompetencyPerformanceExamQuestionSchema = z.object({
  desiredBehavior: z.string(),
  evaluatorComments: z.string(),
  percentScore: z.number(),
  averageScoreForAllPeople: z.number(),
});

const ZAiSummarizeCompetencyPerformanceContextSchema = z.object({
  competencyName: z.string(),
  percentImprovementFromPreviousAttempt: z.number(),
  percentImprovementFromFirstAttempt: z.number(),
  evaluateeName: z.string(),
  examTitle: z.string(),
});

const ZAiSummarizeCompetencyPerformanceMetaSchema = z.object({
  evaluateeId: z.string(),
  formVersionId: z.string(),
  competencyId: z.string(),
});

const dataSchema = z.object({
  type: z.union([
    z.literal("Objective Structured Clinical Exam"),
    z.literal("Survey"),
  ]),
  examQuestions: z.array(ZAiSummarizeCompetencyPerformanceExamQuestionSchema),
});

export const ZAiSummarizeCompetencyPerformanceSchema = z.object({
  data: dataSchema,
  context: ZAiSummarizeCompetencyPerformanceContextSchema,
  meta: ZAiSummarizeCompetencyPerformanceMetaSchema,
});

export const ZAiGenerateSimpleDescriptionSchema = z.object({
  text: z.string().optional(),
  questionId: z.string(),
  specialtyId: z.string(),
});

export const ZAiRecommendMilestonesSchema = z.object({
  id: z.string(),
  text: z.string(),
  formTitle: z.string()
});
