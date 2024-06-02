"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateObject } from "ai";
import { z } from "zod";
import { OpenAI } from "openai";
import { db } from "@/db";
import { milestones } from "@/db/schema";
import { anthropic } from "@ai-sdk/anthropic";
import { ACTIONS, SKILLS, COMPETENCIES } from "@/db/constants";
import { eq } from "drizzle-orm";
import { InferResultType } from "@/db/utils";

type MilestoneRelate = InferResultType<
  "milestones",
  {
    subcompetencies: {
      with: {
        competencies: true;
      };
    };
  }
>;

export async function vectorizeAndUpsertMilestones() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = "milestones";
  const index = pinecone.Index(indexName);

  // get milestones from db
  console.log("Fetching milestones...");
  const milestones = await db.query.milestones.findMany({
    with: {
      subcompetencies: {
        with: {
          competencies: true,
        },
      },
    },
  });
  console.log("Milestones fetched successfully.");
  // transform
  const transformedMilestones = milestones.map((m) => {
    const metadata = JSON.parse(m.metadata as string);
    const competencyName = m.subcompetencies.competencies.name;
    return {
      id: m.id,
      description: m.description,
      simpleDescription: m.simpleDescription,
      // @ts-ignore
      competency: COMPETENCIES[competencyName].name,
      subcompetency: m.subcompetencies.name,
      skills: metadata.skills,
      actions: metadata.actions,
      keywords: metadata.keywords,
    };
  });

  // vectorize and upsert milestones
  console.log("Embedding Milestones...");
  for (const milestone of transformedMilestones) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: JSON.stringify(milestone),
    });
    const [{ embedding }] = embeddingResponse.data;

    console.log("Upserting milestone to index!");
    await index.upsert([
      {
        id: milestone.id,
        values: embedding,
        metadata: milestone,
      },
    ]);
  }
}

// TODO move this... only used for pre seeding pinecone index
export async function transformMilestones(milestoneData: MilestoneRelate[]) {
  console.log("            Transforming Milestones...            ");

  const getPrompt = (milestone: MilestoneRelate) => `
  You are an AI assistant helping to categorize medical education OSCE milestones based on their description and simple description.
    Your task is to select the most relevant skills and actions for each behavior.
    Skills: ${JSON.stringify(SKILLS)}
  Actions: ${JSON.stringify(ACTIONS)}
    For each behavior, follow these steps:
    1. Carefully read the milestone to understand its content and key concepts.
  2. Consider the key skills, competencies, or tasks being assessed in the question.
  3. Using the Skills provided, choose the best that best represent the main ideas, skills, or competencies being evaluated in the milestone.
  4. Using the Actions provided, choose the best that best represent the main actions that could be described by this milestone
  5. Generate up to 5 keywords to help classify the behavior. Use keywords that can help us match a particular OSCE question to a milestone.

Even if you choose to have one tag in a given category, you must use array syntax.
    Now, process the following milestones:
    Description: ${milestone.description}
    Simple Description: ${milestone.simpleDescription}
      `;
  async function getTransform(milestone: MilestoneRelate) {
    const ai = await generateObject({
      model: anthropic("claude-3-haiku-20240307"),
      prompt: getPrompt(milestone),
      schema,
    });

    return ai.object;
  }

  // Process milestones sequentially
  for (const milestone of milestoneData) {
    const transformedMilestone = await getTransform(milestone);
    console.log("Transformed Milestone: ", milestone.description);
    console.log("Tags: ", transformedMilestone);
    await db
      .update(milestones)
      .set({
        metadata: JSON.stringify(transformedMilestone),
      })
      .where(eq(milestones.id, milestone.id));
    console.log("Added tags to DB!");
  }
}

const schema = z.object({
  skills: z
    .array(z.string())
    .min(1)
    .describe("An array of the skills that best fit the given behavior."),
  actions: z
    .array(z.string())
    .min(1)
    .describe("An array of the actions that best fit the given behavior."),
  keywords: z
    .array(z.string())
    .min(1)
    .describe("An array of the keywords that best fit the given behavior."),
});
