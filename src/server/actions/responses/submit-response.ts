"use server";
import { db } from "@/db";
import { responses, answers, formCodes, responsesView } from "@/db/schema";
import { eq } from "drizzle-orm";

type Answer = {
  optionId: string;
  feedback?: string | undefined;
};

type Response = {
  id: string;
  answers: Answer[];
  evaluateeId: string;
  evaluatorId: string;
  duration: number; // seconds
};

function validateResponse(response: Response): void {
  const {
    evaluatorId,
    evaluateeId,
    answers: responseAnswers,
    duration,
  } = response;

  if (!evaluatorId) throw new Error("No CreatorId found!");
  if (!evaluateeId) throw new Error("No EvaluateeId found!");
  if (!duration) throw new Error("No duration found!");
  if (!responseAnswers || responseAnswers.length === 0)
    throw new Error("No answers provided!");
}

export async function submitResponse(response: Response) {
  validateResponse(response);

  const { answers: responseAnswers, duration } = response;

  try {
    const result = await db.transaction(async (tx) => {
      // first get the response
      const currentResponse = await tx.query.responses.findFirst({
        where: eq(responses.id, response.id),
        with: {
          answers: true
        }
      });
      if (!currentResponse) throw new Error("Response does not exist.");

      // if the response has answers that means it has already been submitted once
      if (currentResponse.answers.length > 0) throw new Error("Response has answers");

      // then, check if the form code is a direct observation
      const formCode = await tx.query.formCodes.findFirst({
        where: (fc, { eq }) => eq(fc.id, currentResponse.formCodeId),
      });

      // If it's a direct observation, update the canceledAt field
      if (formCode?.isDirectObservation) {
        await tx
          .update(formCodes)
          .set({ canceledAt: new Date() })
          .where(eq(formCodes.id, formCode.id));
      }

      const newResponse = await tx.query.responses.findFirst({
        where: eq(responses.id, response.id),
      });
      if (!newResponse) throw new Error("Couldn't fetch the response!");

      await tx
        .update(responses)
        .set({ duration })
        .where(eq(responses.id, newResponse.id));

      const answerInserts = responseAnswers.map((answer) => ({
        optionId: answer.optionId,
        responseId: newResponse.id,
        feedback: answer.feedback,
      }));

      await tx.insert(answers).values(answerInserts);
      await db.refreshMaterializedView(responsesView)
      return { responseId: newResponse.id };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error in submitResponse:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
