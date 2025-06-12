'use server';

import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function renameForm({
  formId,
  title,
}: {
  formId: string;
  title: string;
}) {
  await db.update(forms).set({ title }).where(eq(forms.id, formId));
}
