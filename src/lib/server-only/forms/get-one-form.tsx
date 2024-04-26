import { db } from "@/db";

export async function getOneForm(formId: string, userId: string) {
  return await db.query.forms.findFirst({
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
    where: (form, { eq, and, isNull }) =>
      and(
        eq(form.id, formId),
        isNull(form.deletedAt),
        eq(form.creatorId, userId)
      ),
  });
}
