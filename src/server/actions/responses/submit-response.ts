"use server";
import { db } from "@/db";
import { responses, answers, assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TEvaluationFormSchema } from "@/components/(admin)/evaluate/forms/evaluation-form";

export async function submitResponse(response: TEvaluationFormSchema) {
  validateResponse(response);

  const { answers: responseAnswers, duration } = response;

  try {
    const result = await db.transaction(async (tx) => {
      // first get the response, as it is created when the evaluator opens the form
      const currentResponse = await tx.query.responses.findFirst({
        where: eq(responses.id, response.id),
        with: {
          answers: true,
        },
      });
      if (!currentResponse) throw new Error("Response does not exist.");

      // if the response has answers that means it has already been submitted once
      if (currentResponse.answers.length > 0)
        throw new Error("Response has answers");

      // then, check if the form code is a direct observation
      const formCode = await tx.query.assessments.findFirst({
        where: (fc, { eq }) => eq(fc.id, currentResponse.assessmentId),
      });

      // If it's a direct observation, update the canceledAt field
      if (formCode?.isDirectObservation) {
        await tx
          .update(assessments)
          .set({ canceledAt: new Date() })
          .where(eq(assessments.id, formCode.id));
      }

      // not entirely certain why i am refetching the same response, but ill roll w it for the moment
      const newResponse = await tx.query.responses.findFirst({
        where: eq(responses.id, response.id),
      });
      if (!newResponse) throw new Error("Couldn't fetch the response!");

      // set the response duration
      await tx
        .update(responses)
        .set({ duration })
        .where(eq(responses.id, newResponse.id));

      // Process all answers (multiple-choice, single-choice, and written)
      const answerInserts = responseAnswers.flatMap((answer) => {
        const { optionIds, textValue, formItemId, type } = answer;

        if (type === "WRITTEN") {
          return [
            {
              responseId: newResponse.id,
              textValue,
              formItemId,
            },
          ];
        }

        // For both MULTIPLE_CHOICE and SINGLE_CHOICE
        if (!optionIds || optionIds.length === 0) return [];

        return optionIds.map((optionId) => ({
          responseId: newResponse.id,
          optionId,
          textValue,
          formItemId,
        }));
      });

      // Insert all answers in a single operation
      if (answerInserts.length > 0) {
        await tx.insert(answers).values(answerInserts);
      }

      //await db.refreshMaterializedView(answerTotalsView);

      return { responseId: newResponse.id };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error in submitResponse:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

function validateResponse(response: TEvaluationFormSchema) {
  const { answers, duration } = response;

  // check to make sure data is defined
  if (!duration) throw new Error("Response data doesn't contain a duration.");
  if (!answers) throw new Error("Response has no answers");

  return response;
}
