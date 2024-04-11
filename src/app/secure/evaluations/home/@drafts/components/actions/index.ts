"use server";
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteEvaluation = async (evaluationId: string) => {
  await db.delete(evaluations).where(eq(evaluations.id, evaluationId));
  revalidatePath("#");
};
