import { publicProcedure, router } from "@/server/trpc";
import {
  ZAiGenerateInsightsSchema,
  ZAiSummarizeCompetencyPerformanceSchema,
} from "@/server/ai-router/schema";
import { generateInsights } from "@/server/actions/ai/generate-insights";
import { summarizeCompetencyPerformance } from "@/server/actions/ai/summarize-competency-performance";

export const aiRouter = router({
  insights: publicProcedure
    .input(ZAiGenerateInsightsSchema)
    .query(({ input }) => {
      return generateInsights(input);
    }),
  summarizeCompetencyPerformance: publicProcedure
    .input(ZAiSummarizeCompetencyPerformanceSchema)
    .query(({ input }) => {
      return summarizeCompetencyPerformance(input);
    }),
});
