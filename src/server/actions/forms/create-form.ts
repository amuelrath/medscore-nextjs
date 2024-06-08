"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";

export async function createForm({
  title,
  programId,
}: {
  title: string;
  programId: string;
}) {
  const result = await db
    .insert(forms)
    .values({
      title,
      programId,
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    })
    .returning();

  return result[0];
}
