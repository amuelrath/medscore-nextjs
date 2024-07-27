"use server";

import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAssessmentResponsesWithUsers(assessmentId: string) {
  return db.query.responses.findMany({
    where: eq(responses.assessmentId, assessmentId),
    columns: {
      assessmentId: true,
      id: true,
      createdAt: true,
      creatorId: false,
      duration: true,
      evaluateeId: false,
    },
    with: {
      creator: {
        columns: {
          id: true,
          email: false,
          password: false,
          role: true,
          firstName: true,
          lastName: true,
        },
      },
      evaluatee: {
        columns: {
          id: true,
          email: false,
          password: false,
          role: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export type AssessmentResponsesResult = Awaited<
  ReturnType<typeof getAssessmentResponsesWithUsers>
>;
