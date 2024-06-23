"use server";

import { db } from "@/db";
import { studentPerformanceView as view } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  formId: string;
}

// returns the overall score for a given form.
export async function getLongitudinalFormScores({ formId }: Params) {
  return db
    .select({
      formVersionId: view.formVersionId,
      totalPointsAvailable: view.totalPointsAvailable,
      totalPointsEarned: view.totalPointsEarned,
      createdAt: view.createdAt,
    })
    .from(view)
    .where(eq(view.formId, formId));
}

export type TLongitudinalFormScores = Awaited<ReturnType<typeof getLongitudinalFormScores>>