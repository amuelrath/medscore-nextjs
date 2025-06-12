'use server';

import { db } from '@/db';
import { responses, TResponseStatus } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function updateResponseStatus({
  responseId,
  status,
}: {
  responseId: string;
  status: TResponseStatus;
}) {
  return db
    .update(responses)
    .set({ status })
    .where(eq(responses.id, responseId));
}
