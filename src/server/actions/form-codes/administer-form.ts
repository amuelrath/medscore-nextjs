"use server";
import { db } from "@/db";
import { assessments, assessmentsOnEvaluatees } from "@/db/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getAssessmentById } from "@/server/actions/responses/get-assessment";

export async function administerForm({
  isDirectObservation,
  formId,
  userIds,
  expiresAt,
  startsAt,
  title,
  tx=db
}: {
  isDirectObservation?: boolean;
  formId: string | undefined;
  userIds: string[];
  startsAt: Date;
  expiresAt: Date;
  title: string;
  tx?:  PostgresJsDatabase<typeof import("C:/Users/Austin Muelrath/medscore-nextjs/src/db/schema")>
}) {
  if (!formId) throw new Error("Form Id is required");
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const form = await db.query.forms.findFirst({
    where: (f, { eq }) => eq(f.id, formId),
  });

  if (!form) {
    console.error("Form not found!");
    throw new Error("Form not found!");
  }

  // create the form code
  const insertedAssessment = await tx
    .insert(assessments)
    .values({
      formId: form.id,
      code,
      title,
      startsAt,
      expiresAt,
      isDirectObservation,
    })
    .returning();

  // this is inefficient but i want to get joins
  const assessment = await getAssessmentById(insertedAssessment[0].id)

  if (!assessment) throw new Error("Error refetching formcode");

  // link the form code to the users
  await Promise.all(
    userIds.map((u) =>
      tx.insert(assessmentsOnEvaluatees).values({
        assessmentId: assessment.id,
        userId: u,
      }),
    ),
  );

  return {
    ...assessment,
  };
}
