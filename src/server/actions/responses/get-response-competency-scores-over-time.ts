"use server";
import { db } from "@/db";
import { assessments, responseCompetencyScoreView, responses } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getResponseCompetencyScoresOverTime(responseId: string) {
  return db.transaction(async (tx) => {
    // figure out the get responses ids of other
    const currentResponse = await tx.query.responses.findFirst({
      where: eq(responses.id, responseId),
      with: {
        assessment: {
          columns: {
            id: false,
            title: false,
            formId: true,
            createdAt: true,
            expiresAt: false,
            startsAt: false,
            isDirectObservation: false,
            code: false,
            canceledAt: false,
          },
        },
      },
    });
    if (!currentResponse) throw new Error("no response found");

    const {
      evaluateeId,
      assessment: { formId },
    } = currentResponse;

    // now get all responseIds relevant to this form and evaluatee
    const relevantResponses = await tx.query.assessments.findMany({
      where: eq(assessments.formId, formId),
      columns: {
        formId: false,
        createdAt: false,
        code: false,
        isDirectObservation: false,
        canceledAt: false,
        startsAt: false,
        title: false,
        expiresAt: false,
        id: false,
      },
      with: {
        responses: {
          // @ts-expect-error it thinks evaluateeId will be undefined
          where: (r, { eq, and, isNotNull}) => and(isNotNull(r.evaluateeId), eq(r.evaluateeId, evaluateeId)),
          columns: {
            id: true,
            evaluateeId: false,
            createdAt: false,
            creatorId: false,
            duration: false,
            assessmentId: false,
          },
        },
      },
    });

    const relevantResponseIds = relevantResponses.map(a => a.responses.map(r => r.id)).flat()

    return tx
      .select()
      .from(responseCompetencyScoreView)
      .where(inArray(responseCompetencyScoreView.responseId, relevantResponseIds));
  });
}

export type ResponseCompetencyScoresOverTimeResult = NonNullable<Awaited<ReturnType<typeof getResponseCompetencyScoresOverTime>>>