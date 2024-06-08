"use server";
import { z } from "zod";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { recommendedMilestones } from "@/db/schema";
import { db } from "@/db";
import { ACTIONS, SKILLS } from "@/db/constants";

interface QueryMilestonesIndexResult {
  id: string;
  score: number; // the match score
  values: []; // empty array, represents the vector?
  sparseValues: unknown; // idk what this is
  metadata: {
    id: string;
    competency: string;
    subcompetency: string;
    actions: string[];
    skills: string[];
    keywords: string[];
    simpleDescription: string;
    description: string;
  };
}

export async function recommendMilestones({
  id,
  text,
  formTitle,
}: {
  id: string;
  text: string;
  formTitle: string;
}) {
  if (!id || !text) return null;

  // Initialize helpers
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const indexName = "milestones";
  const index = pinecone.Index(indexName);

  // Generate tags for the given question
  const prompt = `
  You are an AI assistant helping to categorize medical education OSCE behaviors.
  Your task is to select the most relevant skills and actions for each behavior given the following lists of skills and actions.
Skills: ${JSON.stringify(SKILLS)}
Actions: ${JSON.stringify(ACTIONS)}
For each behavior, follow these steps:
1. Carefully read the behavior to understand its content and key concepts.
2. Consider the key skills, competencies, or tasks being assessed in the question.
3. Pick the best Skills that best represent the skills assessed by the behavior.
4. Pick the best Actions that best represent the main ideas, actions being evaluated in the behavior. 
5. Generate  keywords to help classify the behavior.

Now, process the following behavior:
Behavior: ${text}
`;

  const ai = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    prompt,
    schema: z.object({
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
        .describe(
          "An array of the keywords that best fit the given behavior. ",
        ),
    }),
  });

  // Create an embedding for the tagged question
  const input = JSON.stringify({
    behavior: text.toLocaleLowerCase(),
    skills: ai.object.skills.map((tag) => tag.toLocaleLowerCase()),
    actions: ai.object.actions.map((tag) => tag.toLocaleLowerCase()),
    keywords: ai.object.keywords.map((keyword) => keyword.toLocaleLowerCase()),
  });
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const [{ embedding }] = embeddingResponse.data;

  // query the index
  const queryResponse = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });

  // get the top three matches
  const bestMatches =
    queryResponse.matches as unknown as QueryMilestonesIndexResult[];
  console.log("Best Matches: ", bestMatches);
  // choose the best match with AI
  const pick = await pickBestMilestone({
    milestones: bestMatches,
    question: text,
    formTitle,
  });
  // add rec to db
  const result = await db
    .insert(recommendedMilestones)
    .values({
      justification: pick.justification,
      score: pick.score?.toString() || "0",
      milestoneId: pick.milestoneId,
      questionId: id,
    })
    .onConflictDoUpdate({
      target: [
        recommendedMilestones.milestoneId,
        recommendedMilestones.questionId,
      ],
      set: {
        questionId: id,
        score: pick.score?.toString(),
        milestoneId: pick.milestoneId,
        justification: pick.justification,
      },
    })
    .returning();

  // return the recs
  return result[0];
}

// function to pick the best milestone given the top 5 vector search results
async function pickBestMilestone({
  milestones,
  question,
  formTitle,
}: {
  milestones: QueryMilestonesIndexResult[];
  question: string;
  formTitle: string;
}) {
  const prompt = `
You are an AI assistant tasked with selecting the most appropriate ACGME milestone based on a given behavior or action from an objective structured clinical exam (OSCE).

Instructions:
1. Analyze the provided behavior or action and the list of milestone candidates.
2. Identify the milestone that most accurately reflects the behavior or action.
3. Provide a concise, 1 sentence justification for your choice, explaining why the milestone fits.
4. Use a professional and confident tone, avoiding first-person language.

Milestone Candidates:
${JSON.stringify(milestones)}

OSCE Context: ${formTitle}

Behavior or Action:
${question}

Response Format:
{
  "milestoneId": "The 'id' property of the best matching milestone",
  "justification": "A very concise explanation focusing on the key principles or competencies demonstrated by the behavior or action, and how they align with the essence of the chosen milestone."
}
`;

  const schema = z.object({
    milestoneId: z
      .string()
      .describe("The 'id' property of the best matching milestone"),
    justification: z
      .string()
      .describe(
        "A very concise explanation focusing on the key principles or competencies demonstrated by the behavior or action, and how they align with the essence of the chosen milestone.",
      ),
  });

  const ai = await generateObject({
    model: anthropic("claude-3-sonnet-20240229"),
    maxTokens: 200,
    prompt,
    schema,
  });

  return {
    milestoneId: ai.object.milestoneId,
    justification: ai.object.justification,
    score: milestones.find((m) => m.id === ai.object.milestoneId)?.score,
  };
}
