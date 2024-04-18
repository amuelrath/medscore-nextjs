"use server";

import { db } from "@/db";
import { ClientEvaluation } from "@/db/client-types";
import { evaluations, publications } from "@/db/schema";
import { and, eq, inArray, notInArray } from "drizzle-orm";

export async function fetchPublishedEvaluations() {
  const publishedEvaluations = await db.query.evaluations.findMany({
    with: { publications: true, programs: true },
    where: and(
      eq(evaluations.creatorId, process.env.DEV_USER_ID!),
      inArray(
        evaluations.id,
        db
          .select({ evaluationId: publications.evaluationId })
          .from(publications)
          .where(eq(publications.evaluationId, evaluations.id))
      )
    ),
  });
  return publishedEvaluations;
}

export async function fetchDraftEvaluations() {
  const unpublishedEvaluations = await db.query.evaluations.findMany({
    with: {
      publications: true,
      programs: {
        with: {
          specialties: {
            with: {
              subcompetencies: {
                with: { milestones: true, competencies: true },
              },
            },
          },
        },
      },
      questions: {
        with: {
          milestones: true,
          options: true,
        },
      },
    },
    where: and(
      eq(evaluations.creatorId, process.env.DEV_USER_ID!),
      notInArray(
        evaluations.id,
        db
          .select({ evaluationId: publications.evaluationId })
          .from(publications)
      )
    ),
  });
  return unpublishedEvaluations as ClientEvaluation[];
}
