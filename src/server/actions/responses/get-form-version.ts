"use server";
import { db } from "@/db";

export async function getFormVersion(formId: string) {
  return await db.query.formVersions.findFirst({
    where: (f, { eq }) => eq(f.id, formId),
    with: {
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
  });
}
