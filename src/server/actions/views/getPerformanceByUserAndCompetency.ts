"use server";
import { db } from "@/db";
import { questionMilestoneView as view } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { COMPETENCIES } from "@/db/constants";

interface Params {
  responseId: string;
  competency: keyof typeof COMPETENCIES;
}

export async function getPerformanceByUserAndCompetency({
  responseId,
  competency,
}: Params) {
  return db
    .select()
    .from(view)
    .where(
      and(eq(view.responseId, responseId), eq(view.competencyName, competency)),
    );
}

export type TPerformanceByUserAndCompetency = Awaited<ReturnType<typeof getPerformanceByUserAndCompetency>>