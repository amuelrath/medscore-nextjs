"use server";
import { db } from "@/db";

export async function getAllForms(userId: string) {
  const result = await db.query.forms.findMany({
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
    where: (form, { isNull, eq, and }) =>
      and(eq(form.creatorId, userId), isNull(form.deletedAt)),
  });
  return result;
}
