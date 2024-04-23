"use server";
import { db } from "@/db";
import { forms, milestonesOnQuestions, options, questions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";

// TODO GET ACTUAL USER DATA FROM SESSION
export async function createNewEvaluation(title: string, programId: string) {
  await db.insert(forms).values({
    id: v4(),
    creatorId: process.env.DEV_USER_ID!,
    title: title,
    programId,
  });

  revalidatePath("layout");
}

export async function softDeleteEvaluation(
  formId: string,
  formVersion: number
) {
  await db
    .update(forms)
    .set({ deletedAt: new Date() })
    .where(and(eq(forms.id, formId), eq(forms.version, formVersion)));

  revalidatePath("layout");
}

// TODO: Alter when making programs many to many
export async function getUserProgram() {
  const currentUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, process.env.DEV_USER_ID!),
    with: {
      programs: true,
    },
  });

  return currentUser?.programs;
}
