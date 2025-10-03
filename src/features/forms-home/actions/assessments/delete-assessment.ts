'use server';

import { db } from '@/db';
import { assessments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// deletes all associated responses as well
export async function deleteAssessment({
  assessmentId,
}: {
  assessmentId: string;
}) {
  return db.delete(assessments).where(eq(assessments.id, assessmentId));
}
