"use server";
import { db } from "@/db";
export type NonNullable<T> = T extends null | undefined ? never : T;

export async function getFormById({
  formId,
  userId,
}: {
  formId: string;
  userId: string;
}) {
  return db.query.forms.findFirst({
    with: {
      assessments: true,
      programs: {
        with: {
          roles: true,
          users: {
            columns: {
              userId: false,
              programId: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  firstName: true,
                  role: true,
                  lastName: true,
                  email: false,
                  password: false,
                },
              },
            },
          },
        },
      },
      formItems: {
        orderBy: (fi, { asc }) => asc(fi.position),
        with: {
          recommendedMilestone: true,
          options: {
            orderBy: (o, { asc }) => asc(o.position)
          },
          milestones: {
            with: {
              milestone: {
                columns: {
                  id: true,
                  name: true,
                  sublevel: true,
                  level: true,
                  description: true,
                  subcompetencyId: true,
                },
              },
            },
          },
        },
      },
    },
    where: (form, { eq, and }) =>
      and(eq(form.id, formId), eq(form.creatorId, userId)),
  });
}

export type FormResult = NonNullable<Awaited<ReturnType<typeof getFormById>>>;
