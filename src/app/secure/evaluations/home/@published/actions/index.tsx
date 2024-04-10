"use server";
import { db } from "@/db";
import { publishedEvaluations } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
export const deletePublishedEvaluation = async (evaluationId: string) => {
  await db
    .delete(publishedEvaluations)
    .where(eq(publishedEvaluations.id, evaluationId));
  revalidatePath("#");
};
