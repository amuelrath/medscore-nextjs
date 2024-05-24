"use server";
import { db } from "@/db";

export async function getAllForms(userId: string) {
  return db.query.forms.findMany({
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
    where: (form, { eq }) => eq(form.creatorId, userId),
  });
}
