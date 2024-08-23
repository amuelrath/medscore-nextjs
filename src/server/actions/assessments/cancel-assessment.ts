'use server';

import { db } from '@/db';
import { assessments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function cancelAssessment({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const now = new Date();

  return db
    .update(assessments)
    .set({ expiresAt: now })
    .where(eq(assessments.id, assessmentId));
}
