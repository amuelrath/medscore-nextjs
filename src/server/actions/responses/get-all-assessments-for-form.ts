"use server";
import { db } from "@/db";

export async function getAllAssessmentsForForm(formId: string) {
  return db.query.assessments.findMany({
    where: (a, { eq }) => eq(a.formId, formId),
    with: {
      evaluatees: {
        columns: {
          assessmentId: false,
          userId: false,
          deletedAt: false,
        },
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              password: false,
              email: false,
              role: true,
            },
          },
        },
      },
      responses: {
        columns: {
          id: true,
          assessmentId: false,
          duration: false,
          createdAt: false,
          creatorId: false,
          evaluateeId: false,
        },
      },
    },
  });
}

export type AssessmentsResult = NonNullable<
  Awaited<ReturnType<typeof getAllAssessmentsForForm>>
>;
