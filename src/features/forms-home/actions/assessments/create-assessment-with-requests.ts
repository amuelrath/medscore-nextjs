'use server';

import { db } from '@/db';
import { assessments, responses } from '@/db/schema';
import { formatDate } from 'date-fns';
import { v4 } from 'uuid';
import { type TAssessmentCreatorFormSchema } from '../../../assessment-wizard/components/assessment-details-form/assessment-details-form';

// todo get logged in user id to use as assessmentRequest.creatorId
export async function createAssessmentWithRequests({
  formId,
  title,
  participants,
  startsAt,
  expiresAt,
}: TAssessmentCreatorFormSchema) {
  if (formId.length > 1)
    throw new Error(
      'Error: Multiple formIds given when creating an assessment.',
    );

  const now = formatDate(new Date(), 'MM/dd/yyyy');

  return db.transaction(async (tx) => {
    // insert the assessment
    const insertedAssessment = await tx
      .insert(assessments)
      .values({
        id: v4(),
        title: title || `Assessment ${now}`,
        formId: formId[0], // the form-multiselect's value is an array of strings, but we limit to just one
        startsAt: new Date(startsAt),
        expiresAt: new Date(expiresAt),
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!, // fixme when we do auth
      })
      .returning();

    // create the actual requests
    const requestsToInsert = transformPairData({
      participants,
      assessmentId: insertedAssessment[0].id,
    });

    // insert them into the db
    return tx.insert(responses).values(requestsToInsert);
  });
}

const transformPairData = ({
  participants,
  assessmentId,
}: {
  participants: TAssessmentCreatorFormSchema['participants'];
  assessmentId: string;
}) => {
  if (!participants) return [];
  // for each 'pair' pull out the ids and create 'response' objects
  return participants.flatMap((pair) =>
    pair.evaluateeIds.map((id) => ({
      assessmentId,
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!, // fixme when we do auth
      respondeeId: pair.evaluatorId[0],
      evaluateeId: id,
    })),
  );
};
