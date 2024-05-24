"use server";

import { AiInsightData } from "@/db/types";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export type InsightsData = {
  strengths: string[];
  weaknesses: string[];
};

export async function generateInsights(
  input: AiInsightData,
): Promise<InsightsData> {
  const result = await generateObject({
    model: openai("gpt-3.5-turbo-16k"),
    prompt: `Given the following JSON data, generate 2 concise strengths and 2 concise weaknesses. You may not directly repeat the given data, use your own words. ${JSON.stringify(input)}`,
    schema: z.object({
      strengths: z
        .array(
          z
            .string()
            .describe(
              "a strength of the evaluatee as it relates to their performance",
            ),
        )
        .length(2),
      weaknesses: z
        .array(
          z
            .string()
            .describe(
              "a weakness of the evaluatee as it relates to their performance",
            ),
        )
        .length(2),
    }),
  });

  return {
    strengths: result.object.strengths,
    weaknesses: result.object.weaknesses,
  };
}
