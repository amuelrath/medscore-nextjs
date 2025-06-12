'use server';

import { db } from '@/db';
import { formFolders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteFolder({ folderId }: { folderId: string }) {
  // delete the folder (should cascade delete all forms with that folderId
  await db.delete(formFolders).where(eq(formFolders.id, folderId));
}
