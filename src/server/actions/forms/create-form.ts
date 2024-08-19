"use server";
import { db } from "@/db";
import { DEFAULT_FORM_SETTINGS } from "@/db/constants";
import { forms, TFormType } from "@/db/schema";
import { getFormLiteById } from "@/server/actions/forms/get-all-forms-lite";

export async function createForm({
  title,
  programId,
  type,
}: {
  title: string;
  programId: string;
  type: TFormType;
}) {
  const defaultSettings = DEFAULT_FORM_SETTINGS[type];

  const [insertedForm] = await db.transaction(async (tx) => {
    const [form] = await tx
      .insert(forms)
      .values({
        title,
        programId,
        settings: defaultSettings,
        type,
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      })
      .returning();

    return [form];
  });

  return getFormLiteById({ formId: insertedForm.id });
}
