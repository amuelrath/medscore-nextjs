"use server";
import { db } from "@/db";
import {
  NewEvaluation,
  evaluations,
  milestonesOnQuestions,
  options,
  questions,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO GET ACTUAL USER DATA FROM SESSION
export async function createEvaluation(data: FormData) {
  const title = data.get("title");
  const description = data.get("description");

  const programIdQuery = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, process.env.DEV_USER_ID!),
    columns: { id: true },
    with: {
      programs: true,
    },
  });

  if (!programIdQuery) throw new Error("Program not found");
  const programId = programIdQuery?.programs?.id;
  if (!programId) throw new Error("Program not found");

  const insertEvaluation = async (data: NewEvaluation) => {
    return db.insert(evaluations).values(data);
  };

  const newEvaluation: NewEvaluation = {
    title: title as string,
    description: description as string,
    programId: programId,
    creatorId: process.env.DEV_USER_ID!,
  };

  await insertEvaluation(newEvaluation);
  revalidatePath("#"); // could be an issue
}

export const deleteEvaluation = async (evaluationId: string) => {
  await db.delete(evaluations).where(eq(evaluations.id, evaluationId));
  revalidatePath("#");
};
