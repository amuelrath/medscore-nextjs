"use server";
import { db } from "@/db";
import { evaluations, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function getEvaluation(id: string) {
  const evaluationQuery = await db.query.evaluations.findFirst({
    where: (evaluation, { eq }) => eq(evaluation.id, id),
    with: {
      questions: {
        with: {
          options: true,
        },
      },
    },
  });

  if (evaluationQuery?.creatorId !== process.env.DEV_USER_ID) {
    return new Error("Unauthorized");
  }

  return evaluationQuery;
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function createQuestion(evaluationId: string) {
  const evaluation = await db.query.evaluations.findFirst({
    where: (evaluations, { eq }) => eq(evaluations.id, evaluationId),
  });

  if (evaluation?.creatorId !== process.env.DEV_USER_ID) {
    return new Error("Unauthorized");
  }

  await db.insert(questions).values({
    evaluationId,
  });

  revalidatePath("#");
}

export async function deleteQuestion(questionId: string) {
  const question = await db.query.questions.findFirst({
    where: (question, { eq }) => eq(question.id, questionId),
    with: { evaluations: true },
  });

  if (question?.evaluations?.creatorId !== process.env.DEV_USER_ID) {
    return new Error("Unauthorized");
  }

  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath("#");
}
