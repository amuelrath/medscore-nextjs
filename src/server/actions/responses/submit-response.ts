"use server";
import { db } from "@/db";
import { responses, answers, formCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

type Answer = {
  optionId: string;
  feedback?: string | undefined;
};

type Response = {
  answers: Answer[];
  formCodeId: string;
  evaluateeId: string;
  evaluatorId: string;
  duration: number; // seconds
};

function validateResponse(response: Response): void {
  const {
    evaluatorId,
    evaluateeId,
    formCodeId,
    answers: responseAnswers,
    duration,
  } = response;

  if (!evaluatorId) throw new Error("No CreatorId found!");
  if (!evaluateeId) throw new Error("No EvaluateeId found!");
  if (!formCodeId) throw new Error("No FormCodeId found!");
  if (!duration) throw new Error("No duration found!");
  if (!responseAnswers || responseAnswers.length === 0)
    throw new Error("No answers provided!");
}

export async function submitResponse(response: Response) {
  validateResponse(response);

  const {
    evaluatorId: creatorId,
    evaluateeId,
    formCodeId,
    answers: responseAnswers,
    duration,
  } = response;

  try {
    const result = await db.transaction(async (tx) => {
      // First, check if the form code is a direct observation
      const formCode = await tx.query.formCodes.findFirst({
        where: (fc, { eq }) => eq(fc.id, formCodeId),
      });

      // If it's a direct observation, update the canceledAt field
      if (formCode?.isDirectObservation) {
        await tx
          .update(formCodes)
          .set({ canceledAt: new Date() })
          .where(eq(formCodes.id, formCode.id));
      }

      const [newResponse] = await tx
        .insert(responses)
        .values({
          formCodeId,
          creatorId,
          evaluateeId,
          duration,
        })
        .returning();

      if (!newResponse) throw new Error("Failed to create response");

      const answerInserts = responseAnswers.map((answer) => ({
        optionId: answer.optionId,
        responseId: newResponse.id,
        feedback: answer.feedback,
      }));

      await tx.insert(answers).values(answerInserts);

      return { responseId: newResponse.id };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error in submitResponse:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
