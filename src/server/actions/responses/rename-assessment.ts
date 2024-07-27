"use server";
import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function renameAssessment({
  assessmentId,
  title,
}: {
  assessmentId: string;
  title: string;
}) {
  return db
    .update(assessments)
    .set({ title })
    .where(eq(assessments.id, assessmentId));
}
