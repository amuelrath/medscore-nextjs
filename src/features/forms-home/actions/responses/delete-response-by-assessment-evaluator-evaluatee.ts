'use server';

import { db } from '@/db';
import { responses } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function deleteResponseByAssessmentEvaluatorEvaluatee({
  assessmentId,
  evaluatorId,
  evaluateeId,
}: {
  assessmentId: string;
  evaluatorId: string;
  evaluateeId: string;
}) {
  return db
    .delete(responses)
    .where(
      and(
        eq(responses.assessmentId, assessmentId),
        eq(responses.respondeeId, evaluatorId),
        eq(responses.evaluateeId, evaluateeId),
      ),
    );
}
