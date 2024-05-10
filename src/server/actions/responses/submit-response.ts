"use server";
import { db } from "@/db";
import { TResponseSchema } from "@/db/types";
import { responses, answers } from "@/db/schema";

export async function submitResponse(response: TResponseSchema) {
  const creatorId = response.creatorId; // TODO Replace with actual user Id
  const evaluateeId = response.evaluateeId;
  const formVersionId = response.formVersionId;

  if (!creatorId) throw new Error("No CreatorId found!")
  if (!evaluateeId) throw new Error("No EvaluateeId found!")
  if (!formVersionId) throw new Error("No FormVersionId found!")

  return db.transaction(async (tx) => {
    // create the response object
    const responseQuery = await tx
      .insert(responses)
      .values({
        formVersionId,
        creatorId,
        evaluateeId,
      })
      .returning();

    // now create the answer objects
    for (let answer of response.answers) {
      await tx.insert(answers).values({
        questionVersionId: answer.questionVersionId,
        optionVersionId: answer.optionVersionId,
        responseId: responseQuery[0].id,
        feedback: answer.feedback,
      });
    }
  });
}
