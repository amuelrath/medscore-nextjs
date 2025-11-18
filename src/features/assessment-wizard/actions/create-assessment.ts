'use server';

import { db } from '@/db';
import { assessmentComponents, assessments, requests } from '@/db/schema';
import { TAssessmentSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';

interface Params {
  assessment: TAssessmentSchema;
  creatorId: string;
}

export async function createAssessment({
  assessment: { details, components },
  creatorId,
}: Params) {
  return db.transaction(async (tx) => {
    // step 1: create Assessment and save its ID
    const insertedAssessment = await tx
      .insert(assessments)
      .values({
        creatorId,
        title: details.title,
      })
      .returning({ assessmentId: assessments.id });

    // step 2: create an AssessmentComponent for each component and save IDs
    const componentPromises = components.map((c) =>
      tx.insert(assessmentComponents).values({
        id: c.id,
        assessmentId: insertedAssessment[0].assessmentId,
        formId: c.formId,
        responseRevisions: c.revisions,
        saveAndQuit: c.saveAndQuit,
        multipleResponses: c.multipleResponses,
      }),
    );

    try {
      await Promise.all(componentPromises);
    } catch (error) {
      console.error("Couldn't add assessment components: ", error);
    }

    // step 3: create requests for each component
    const pairRequestPromises = components
      .filter((c) => c.type === 'EVALUATION' || c.type === 'STATION')
      ?.flatMap((c) =>
        c.respondeeIds.flatMap((r) =>
          c.evaluateeIds!.map((e) =>
            tx.insert(requests).values({
              respondeeId: r,
              evaluateeId: e,
              startsAt: new Date(c.startsAt),
              expiresAt: new Date(c.expiresAt),
              componentId: c.id,
              status: 'NOT_STARTED',
            }),
          ),
        ),
      );

    const singleRequestPromises = components
      .filter((c) => c.type === 'SURVEY')
      ?.flatMap((c) =>
        c.respondeeIds.map((r) =>
          tx.insert(requests).values({
            respondeeId: r,
            startsAt: new Date(c.startsAt),
            expiresAt: new Date(c.expiresAt),
            componentId: c.id,
            status: 'NOT_STARTED',
          }),
        ),
      );

    try {
      await Promise.all([...pairRequestPromises, ...singleRequestPromises]);
    } catch (error) {
      console.error("Couldn't add requests: ", error);
    }
  });
}
