"use server";
import { db } from "@/db";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { ZAiSummarizeCompetencyPerformanceSchema } from "@/server/ai-router/schema";
import { competencyPerformanceSummaries } from "@/db/schema";

type FeedbackInput = z.infer<typeof ZAiSummarizeCompetencyPerformanceSchema>;

export async function summarizeCompetencyPerformance(input: FeedbackInput) {
  if (!input) return null;

  // Check to see if feedback has already been summarized
  const existingSummary =
    await db.query.competencyPerformanceSummaries.findFirst({
      where: (summary, { eq, and }) =>
        and(
          eq(summary.evaluateeId, input.meta.evaluateeId),
          eq(summary.formVersionId, input.meta.formVersionId),
          eq(summary.competencyId, input.meta.competencyId),
        ),
    });
  if (existingSummary) return existingSummary;

  // Generate a feedback summary
  const newSummary = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    prompt: `Given the following data for ${input.context.evaluateeName}'s performance in the ACGME core competency of ${input.context.competencyName} during a(n) ${input.data.type}, provide a comprehensive summary of their performance in the given skill area. Do not return any lists.

Instructions:
1. Analyze the evaluatee's scores and the evaluator's comments to identify patterns, trends, or notable observations.
2. Synthesize the information to draw insights about the evaluatee's strengths, weaknesses, and overall performance in the competency area.
3. Provide specific examples or references to support your conclusions, but avoid directly repeating the desired behaviors unless absolutely necessary for clarity.
4. If there is insufficient information to make a definitive statement about a particular aspect of the evaluatee's performance, acknowledge the uncertainty and move on.
5. Summarize the evaluator's feedback and note any alignment or discrepancies with the scores and your analysis.
6. Consider the evaluatee's improvement from previous attempts and incorporate this information into your summary if relevant.
7. Use the context of the exam and competency to provide a comprehensive and insightful analysis of the evaluatee's performance.

Evaluator Comments and Scores:
${input.data.examQuestions
  .map(
    (question) => `
Desired Behavior: ${question.desiredBehavior}
Evaluator Comment: ${question.evaluatorComments}
Evaluatee Score: ${question.percentScore.toFixed(1)}%
Average Score: ${question.averageScoreForAllPeople.toFixed(1)}%
`,
  )
  .join("\n")}
  
Percent Improvement in ${input.context.competencyName} from previous attempt:
${input.context.percentImprovementFromPreviousAttempt}
 
Percent Improvement in ${input.context.competencyName} from first attempt:
${input.context.percentImprovementFromFirstAttempt}

Summary:`,
    schema: z.object({
      strengthsSummary: z
        .string()
        .describe(
          "An insightful, specific, and concise summary of the evaluatee's strengths based on the analysis of scores, comments, and improvements. If there are no clear strengths, acknowledge this uncertainty.",
        )
        .optional(),
      weaknessesSummary: z
        .string()
        .describe(
          "An insightful, specific, and concise summary of the evaluatee's weaknesses based on the analysis of scores, comments, and improvements. If there are no clear weaknesses, acknowledge this uncertainty.",
        )
        .optional(),
      feedbackSummary: z
        .string()
        .describe(
          "An insightful, specific, and concise summary of the evaluator's overall feedback, noting alignment or discrepancies with the scores and analysis. If there is insufficient information to make a determination, acknowledge this uncertainty.",
        )
        .optional(),
    }),
  });
  // Add it to the database
  const newData = await db
    .insert(competencyPerformanceSummaries)
    .values({
      feedback: newSummary.object.feedbackSummary,
      strengths: newSummary.object.strengthsSummary,
      weaknesses: newSummary.object.weaknessesSummary,
      evaluateeId: input.meta.evaluateeId,
      formVersionId: input.meta.formVersionId,
      competencyId: input.meta.competencyId,
    })
    .returning();

  return newData[0];
}
