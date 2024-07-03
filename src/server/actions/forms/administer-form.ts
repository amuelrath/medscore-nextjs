"use server";
import { db } from "@/db";
import { formCodes, formCodesOnUsers } from "@/db/schema";

export async function administerForm({
  isDirectObservation,
  formId,
  userIds,
  expiresAt,
  startsAt,
  title,
}: {
  isDirectObservation?: boolean;
  formId: string | undefined;
  userIds: string[];
  startsAt?: Date;
  expiresAt: Date;
  title: string;
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
  const formCode = await db
    .insert(formCodes)
    .values({
      formId: form.id,
      code,
      title,
      startsAt,
      expiresAt,
      isDirectObservation,
    })
    .returning();

  // link the form code to the users
  await Promise.all(
    userIds.map((u) =>
      db.insert(formCodesOnUsers).values({
        formCodeId: formCode[0].id,
        userId: u,
      }),
    ),
  );

  return {
    ...formCode[0],
  };
}
