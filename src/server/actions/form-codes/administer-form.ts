"use server";
import { db } from "@/db";
import { assessments, assessmentsOnEvaluatees } from "@/db/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

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
  const insertFormCode = await tx
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
  const formCode = await tx.query.assessments.findFirst({
    where: (fc, { eq }) => eq(fc.id, insertFormCode[0].id),
    with: {
      evaluatees: {
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              email: false,
              password: false,
              role: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!formCode) throw new Error("Error refetching formcode");

  // link the form code to the users
  await Promise.all(
    userIds.map((u) =>
      tx.insert(assessmentsOnEvaluatees).values({
        assessmentId: formCode.id,
        userId: u,
      }),
    ),
  );

  return {
    ...formCode,
  };
}
