import z from "zod";

export const ZAiGenerateInsightsSchema = z.object({
  exam: z.object({
    type: z.union([
      z.literal("Objective Structured Clinical Exam"),
      z.literal("Survey"),
    ]),
    specialty: z.string(),
    title: z.string(),
    administeredAt: z.string(),
    evaluatee: z.object({
      name: z.string(),
      role: z.union([
        z.literal("Medical Resident"),
        z.literal("Medical Fellow"),
      ]),
    }),
    overallPerformance: z.object({
      averageScore: z.number(),
      percentileRank: z.number(),
      questionsAboveAverage: z.number(),
      questionsBelowAverage: z.number(),
    }),
    domains: z.array(
      z.object({
        name: z.union([
          z.literal("Patient Care"),
          z.literal("Medical Knowledge"),
          z.literal("Professionalism"),
          z.literal("Systems-Based Practice"),
          z.literal("Practice-Based Learning and Improvement"),
          z.literal("Interpersonal and Communication Skills"),
        ]),
        percentChangeFromPreviousAttempt: z.number(),
        percentChangeFromFirstAttempt: z.number(),
        timeVersusScoreCorrelationCoefficient: z.number(),
        questionsFromExam: z.array(
          z.object({
            questionText: z.string(),
            allocatedAcgmeMilestoneDescription: z.string(),
            percentScore: z.number(),
            averageScore: z.number(),
            percentileRank: z.number(),
            evaluatorFeedback: z.string(),
          }),
        ),
      }),
    ),
  }),
});

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
