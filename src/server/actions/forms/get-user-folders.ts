'use server';

import { db } from '@/db';

export async function getUserFolders({ userId }: { userId: string }) {
  return db.query.formFolders.findMany({
    where: (folder, { eq }) => eq(folder.creatorId, userId),
    with: {
      forms: {
        columns: {
          id: true,
          title: true,
          lastOpenedAt: true,
          type: true,
        },
      },
    },
  });
}

export type UserFoldersResult = Awaited<ReturnType<typeof getUserFolders>>;
