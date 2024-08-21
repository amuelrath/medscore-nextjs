"use server";
import { db } from "@/db";

export async function getAllAssessmentsForForm(formId: string) {
  return db.query.assessments.findMany({
    where: (a, { eq }) => eq(a.formId, formId),
    with: {
      responses: {
        columns: {
          id: true,
          assessmentId: false,
          duration: false,
          createdAt: false,
          respondeeId: false,
          evaluateeId: false,
        },
      },
    },
  });
}

export type AssessmentsResult = NonNullable<
  Awaited<ReturnType<typeof getAllAssessmentsForForm>>
>;
