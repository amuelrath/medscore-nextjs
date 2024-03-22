"use server";
import { db } from "@/db";
import { NewEvaluation, evaluation } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getUserPrograms() {
  "use server";
  const query = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, process.env.DEV_USER_ID!),
    columns: { id: true },
    with: {
      program: true,
    },
  });

  return query?.program;
}

// TODO GET ACTUAL USER DATA FROM SESSION
export async function createEvaluation(data: FormData) {
  const title = data.get("title");
  const description = data.get("description");

  const insertEvaluation = async (data: NewEvaluation) => {
    return db.insert(evaluation).values(data);
  };
  const newEvaluation: NewEvaluation = {
    title: title as string,
    description: description as string,
    programId: "7d796f15-74f8-4691-9aac-5efe8349db46",
    creatorId: process.env.DEV_USER_ID,
  };

  await insertEvaluation(newEvaluation);
  revalidatePath("#");
}
