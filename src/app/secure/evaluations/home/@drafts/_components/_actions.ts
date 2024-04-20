"use server";
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteEvaluation = async (evaluationId: string) => {
  await db.transaction(async (tx) => {
    let isDeleted = await tx.query.evaluations.findFirst({
      where: (evaluations, { eq, and, isNotNull }) =>
        and(eq(evaluations.id, evaluationId), isNotNull(evaluations.deletedAt)),
    });

    if (isDeleted) throw new Error("Evaluation has already been deleted");

    await db
      .update(evaluations)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(evaluations.id, evaluationId));
  });

  revalidatePath("#");
};
