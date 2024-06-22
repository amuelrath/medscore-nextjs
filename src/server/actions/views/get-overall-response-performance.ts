"use server";

import { db } from "@/db";
import { studentPerformanceView as view } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  formId: string;
}

// returns the overall score for a given form.
export async function getOverallResponsePerformance({ formId }: Params) {
  return db.select().from(view).where(eq(view.formId, formId));
}
