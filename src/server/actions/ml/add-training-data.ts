"use server";

import { db } from "@/db";
import { recommendedMilestones } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addTrainingData({
  recommendationId,
  isPositiveClassification,
}: {
  recommendationId: string;
  isPositiveClassification: boolean;
}) {
  await db
    .update(recommendedMilestones)
    .set({ isPositiveClassification })
    .where(eq(recommendedMilestones.id, recommendationId));
  console.log("Added training data.");
}
