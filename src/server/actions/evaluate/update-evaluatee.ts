'use server'

import { db } from "@/db"
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function chooseEvaluatee(responseId: string, evaluateeId: string) {
  await db.update(responses).set({ evaluateeId }).where(eq(responses.id, responseId))
}