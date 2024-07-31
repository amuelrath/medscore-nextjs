"use server";
import { db } from "@/db";
import { forms, TFormType } from "@/db/schema";
import {
  getFormLiteById,
} from "@/server/actions/forms/get-all-forms-lite";

export async function createForm({
  title,
  programId,
  type,
}: {
  title: string;
  programId: string;
  type: TFormType;
}) {
  const insertedForm = await db
    .insert(forms)
    .values({
      title,
      programId,
      type,
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    })
    .returning();

  return getFormLiteById({ formId: insertedForm[0].id });

}
