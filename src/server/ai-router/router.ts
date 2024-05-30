import { publicProcedure, router } from "@/server/trpc";
import {
  ZAiRecommendMilestonesSchema,
  ZAiSummarizeCompetencyPerformanceSchema,
} from "@/server/ai-router/schema";
import { summarizeCompetencyPerformance } from "@/server/actions/ai/summarize-competency-performance";
import { recommendMilestones } from "@/server/actions/ai/recommend-milestones";

export const aiRouter = router({
  summarizeCompetencyPerformance: publicProcedure
    .input(ZAiSummarizeCompetencyPerformanceSchema)
    .query(({ input }) => {
      return summarizeCompetencyPerformance(input);
    }),
  recommendMilestones: publicProcedure
    .input(ZAiRecommendMilestonesSchema)
    .mutation(({ input }) => {
      return recommendMilestones(input);
    }),
});
