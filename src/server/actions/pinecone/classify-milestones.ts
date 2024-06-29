"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { db } from "@/db";

export async function embedAndUpsertBehaviors() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = "behaviors";
  const index = pinecone.Index(indexName);

  // get behaviors from db
  console.log("Fetching behaviors...");
  const behaviors = await db.query.behaviors.findMany();
  console.log("Behaviors fetched successfully.");

  // vectorize and upsert
  console.log("Embedding Milestones...");
  for (const behavior of behaviors) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: JSON.stringify(behavior.description),
    });
    const [{ embedding }] = embeddingResponse.data;

    console.log("Upserting to index!");
    await index.upsert([
      {
        id: behavior.id,
        metadata: {
          subcompetencyId: behavior.subcompetencyId,
        },
        values: embedding,
      },
    ]);
  }
}
