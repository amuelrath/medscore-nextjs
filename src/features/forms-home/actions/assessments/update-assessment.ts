'use server';

import { TAssessmentEditorFormSchema } from '@/features/forms-home/components/assessment-manager/assessment-creator-dialog';
import { db } from '@/db';
import { assessments, responses } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

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

    // Handle responses that are no longer in the participants list
    if (existingResponseMap.size > 0) {
      const responsesToUpdate = Array.from(existingResponseMap.values());

      // Update status to 'removed' for responses that haven't been started
      await tx.delete(responses).where(
        and(
          inArray(
            responses.id,
            responsesToUpdate.map((r) => r.id),
          ),
          eq(responses.status, 'NOT_STARTED'),
        ),
      );

      // For responses that have been started, we keep them as is
      // You might want to add a flag or note to indicate they're no longer part of the active assessment
    }

    // Insert new responses
    if (newResponses.length > 0) {
      await tx.insert(responses).values(newResponses);
    }

    return { success: true };
  });
}
