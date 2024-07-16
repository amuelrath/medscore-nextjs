"use server";
import { db } from "@/db";
import { answerTotalsView } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAnswerTotalsViewByResponseId(responseId: string) {
  return db
    .select()
    .from(answerTotalsView)
    .where(eq(answerTotalsView.responseId, responseId));
}

export async function getAnswerTotalsView() {
  return db.select().from(answerTotalsView);
}
