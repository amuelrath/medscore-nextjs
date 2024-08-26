'use server';

import { TAssessmentEditorFormSchema } from '@/components/(admin)/forms/home/assessment-manager/assessment-creator-dialog';
import { db } from '@/db';
import { assessments, responses } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

type UpdateAssessmentParams = TAssessmentEditorFormSchema & {
  assessmentId: string;
};

export async function updateAssessment({
  assessmentId,
  title,
  startsAt,
  expiresAt,
  participants,
}: UpdateAssessmentParams) {
  return db.transaction(async (tx) => {
    // First get the existing assessment with responses
    const assessment = await tx.query.assessments.findFirst({
      where: eq(assessments.id, assessmentId),
      with: {
        responses: {
          columns: {
            id: true,
            respondeeId: true,
            evaluateeId: true,
            status: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Update the assessment itself
    await tx
      .update(assessments)
      .set({
        title,
        startsAt: new Date(startsAt),
        expiresAt: new Date(expiresAt),
      })
      .where(eq(assessments.id, assessmentId));

    // Handle responses
    const existingResponses = assessment.responses;
    const newResponses: (typeof responses.$inferInsert)[] = [];

    // Create a map of existing responses for quick lookup
    const existingResponseMap = new Map(
      existingResponses.map((r) => [`${r.respondeeId}-${r.evaluateeId}`, r]),
    );

    // Process participants
    participants?.forEach((participant) => {
      participant.evaluatorId.forEach((evaluatorId) => {
        participant.evaluateeIds.forEach((evaluateeId) => {
          const key = `${evaluatorId}-${evaluateeId}`;
          const existingResponse = existingResponseMap.get(key);

          if (existingResponse) {
            // Update existing response if status has changed
            if (existingResponse.status !== participant.status) {
              tx.update(responses)
                .set({ status: participant.status })
                .where(eq(responses.id, existingResponse.id));
            }
            existingResponseMap.delete(key);
          } else {
            // Add new response
            newResponses.push({
              assessmentId,
              respondeeId: evaluatorId,
              evaluateeId,
              status: participant.status,
            });
          }
        });
      });
    });

    // Remove responses that are no longer needed
    if (existingResponseMap.size > 0) {
      const responsesToDelete = Array.from(existingResponseMap.values()).map(
        (r) => r.id,
      );
      await tx
        .delete(responses)
        .where(inArray(responses.id, responsesToDelete));
    }

    // Insert new responses
    if (newResponses.length > 0) {
      await tx.insert(responses).values(newResponses);
    }

    return { success: true };
  });
}
