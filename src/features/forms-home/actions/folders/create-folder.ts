'use server';

import { db } from '@/db';
import { formFolders } from '@/db/schema';

export async function createFolder({
  creatorId,
  title,
}: {
  creatorId: string;
  title: string;
}) {
  await db.insert(formFolders).values({ creatorId, title });
}
