"use server";
import { z } from "zod";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { recommendedMilestones } from "@/db/schema";
import { db } from "@/db";

interface QueryIndexResult {
  matches: {
    id: string;
    score: number;
    values: []; // will never be defined,
    sparseValues: undefined; // will never be defined
    metadata: {
      subcompetencyId: string;
    };
  }[];
  namespace: string;
  usage: {
    readUnits: number;
  };
}

// function to get the best matching subcompetencyIds given a question
export async function getIndexMatches({ text }: { text: string }) {
  if (!text) return null;
  // Initialize helpers
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const indexName = "behaviors";
  const index = pinecone.Index(indexName);

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: JSON.stringify(text), // i shouldn't be doing this but just testing it out
  });
  const [{ embedding }] = embeddingResponse.data;

  return index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
    includeValues: false,
  });
}

// function to pick the best milestone given the top 5 vector search results
export async function pickBestMilestone({
  questionId,
  formTitle,
}: {
  questionId: string;
  formTitle: string;
}) {
  const question = await db.query.questions.findFirst({
    where: (q, { eq }) => eq(q.id, questionId),
  });
  const matches = await getIndexMatches({ text: question?.text || "" });
  const matchingSubcompetencyIds = matches?.matches?.map(
    (match) => match.metadata?.subcompetencyId,
  ) as string[];
  const milestones = await db.query.milestones.findMany({
    columns: {
      id: true,
      subcompetencyId: false,
      name: true,
      description: true,
      level: true,
      sublevel: false,
    },
    where: (m, { inArray }) =>
      inArray(m.subcompetencyId, matchingSubcompetencyIds),
  });

  const prompt = `
  You are an expert in medical education and assessment. Your task is to select the most appropriate milestone for a given Competency Based Assessment question and provide a concise, insightful justification.

    Context:
  - Competency Based Assessment Title: ${formTitle}
    - Competency Based Assessment Question: ${question?.text}

    Available Milestones:
    ${milestones
      .map(
        (m) => `
    ID: ${m.id}
    Name: ${m.name}
      Description: ${m.description}
        Level: ${m.level}
          `,
      )
      .join("\n")}

Instructions:
1. Carefully read the Competency Based Assessment's title and question.
2. Review each provided milestone, considering its name, description, and level.
3. Select the milestone that best matches the skills, knowledge, or behaviors being assessed in the OSCE question.
4. Provide a brief, insightful justification for your selection, focusing on the key connection between the OSCE question and the chosen milestone.

Your response should be in JSON format with the following structure:
{
  "milestoneId": "The ID of the selected milestone",
  "justification": "A single, concise sentence (15-25 words) explaining the core reason this milestone is the best match. Focus on the specific skill or behavior being assessed and its importance.",
  "confidenceScore": "A number from 0-10 indicating your confidence that the chosen milestone is an accurate match."
}

Important Notes:
- Your justification should be a single, impactful sentence that captures the essence of why this milestone is the best match.
- Avoid restating the milestone or OSCE question. Instead, explain the key skill or behavior being assessed and its significance.
- Use active voice and precise language to convey your point clearly and concisely.
- Consider the level of the milestone in relation to the complexity of the OSCE question.
- Milestones are categorized by level:
  - Level 1: Novice resident/fellow, brand new to the specialty
  - Level 2: Advanced beginner, performs some tasks with limited autonomy
  - Level 3: Competent resident/fellow, performs common tasks autonomously
  - Level 4: Proficient resident/fellow
  - Level 5: Expert resident/fellow, exceeds peers

Example of a good justification:
"Open-ended questioning is crucial for generating comprehensive differential diagnoses in acute presentations."

Remember, your goal is to provide a clear, concise, and insightful connection between the OSCE question and the chosen milestone.
  `;

  const schema = z.object({
    milestoneId: z
      .string()
      .describe(
        "The Id of the milestone that best matches the given question.",
      ),
    justification: z
      .string()
      .describe(
        "A very brief explanation of why the chosen milestone is the best match.",
      ),
    confidenceScore: z
      .number()
      .min(0)
      .max(10)
      .describe(
        "A number from 0-10 indicating your confidence in the chosen milestone being an accurate match.",
      ),
  });

  const ai = await generateObject({
    model: anthropic("claude-3-sonnet-20240229"),
    prompt,
    schema,
  });
  const { milestoneId, confidenceScore, justification } = ai.object;

  return db
    .insert(recommendedMilestones)
    .values({
      milestoneId,
      score: confidenceScore,
      justification,
      questionId: question?.id || "",
    })
    .onConflictDoUpdate({
      target: [recommendedMilestones.id],
      set: {
        milestoneId,
        justification,
        score: confidenceScore,
      },
    })
    .returning();
}
