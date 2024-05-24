import { db } from "@/db";
import { DateToString } from "@/db/utils";
export type NonNullable<T> = T extends null | undefined ? never : T;

export async function getOneForm(formId: string, userId: string) {
  return db.query.forms.findFirst({
    with: {
      programs: {
        with: {
          users: {
            with: {
              user: true,
            },
          },
        },
      },
      questions: {
        orderBy: (q, { asc }) => asc(q.position),
        with: {
          options: true,
          milestones: {
            with: {
              milestone: true,
            },
          },
        },
      },
    },
    where: (form, { eq, and }) =>
      and(eq(form.id, formId), eq(form.creatorId, userId)),
  });
}

export type FormResult = NonNullable<
  DateToString<Awaited<ReturnType<typeof getOneForm>>>
>;
