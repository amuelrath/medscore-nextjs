'use server';

import { db } from '@/db';

export async function getAllUsers({ programId }: { programId: string }) {
  const users = await db.query.programs.findMany({
    where: (p, { eq }) => eq(p.id, programId),
    columns: {
      id: true,
      name: false,
      description: false,
      specialtyId: false,
    },
    with: {
      users: {
        columns: {
          userId: false,
          programId: false,
        },
        with: {
          user: {
            columns: {
              id: true,
              role: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return users.flatMap(u => u.users).map(u => u.user)

}

export type AllUsersResult = NonNullable<
  Awaited<ReturnType<typeof getAllUsers>>
>;
