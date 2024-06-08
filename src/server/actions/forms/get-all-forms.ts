"use server";
import { db } from "@/db";
import { NonNullable } from "@/server/actions/forms/get-form-by-id";

export async function getAllForms({ userId }: { userId: string }) {
  return db.query.forms.findMany({
    with: {
      programs: {
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
                  firstName: true,
                  lastName: true,
                  email: false,
                  password: false,
                },
              },
            },
          },
        },
      },
      questions: {
        orderBy: (q, { asc }) => asc(q.position),
        with: {
          recommendedMilestone: true,
          options: true,
          milestones: {
            with: {
              milestone: {
                columns: {
                  id: true,
                  simpleDescription: false,
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
    where: (form, { eq }) => eq(form.creatorId, userId),
  });
}

export type FormsResult = NonNullable<Awaited<ReturnType<typeof getAllForms>>>;
