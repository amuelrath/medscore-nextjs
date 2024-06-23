"use server";
import { db } from "@/db";
import { questionMilestoneView as view } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  responseId: string;
}

export async function getPerformanceByForm({ responseId }: Params) {
  return db
    .select({
      competencyName: view.competencyName,
      subcompetencyName: view.subcompetencyName,
      pointsEarned: view.pointsEarned,
      pointsAvailable: view.pointsAvailable,
      createdAt: view.createdAt,
      formVersionId: view.formVersionId,
    })
    .from(view)
    .where(eq(view.responseId, responseId));
}

export type TCompetencyPerformanceByResponse = Awaited<
  ReturnType<typeof getPerformanceByForm>
>;
