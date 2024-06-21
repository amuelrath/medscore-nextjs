"use server";
import { db } from "@/db";
import { questionMilestoneView as view } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  responseId: string;
}

export async function getQuestionPerformanceByMilestone({
  responseId,
}: Params) {
  await db.select().from(view).where(eq(view.responseId, responseId));
}
