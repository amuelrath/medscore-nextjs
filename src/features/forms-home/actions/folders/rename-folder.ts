'use server';

import { db } from '@/db';
import { formFolders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function renameFolder({
  folderId,
  title,
}: {
  folderId: string;
  title: string;
}) {
  await db
    .update(formFolders)
    .set({ title })
    .where(eq(formFolders.id, folderId));
}
