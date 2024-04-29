"use server";
import { db } from "@/db";
import { programs } from "@/db/schema";

export async function getCurrentPrograms(userId: string) {
  const result = await db.query.usersOnPrograms.findMany({
    columns: {
      userId: false,
      programId: false,
    },
    with: {
      program: true,
    },
    where: (program, { eq }) => eq(program.userId, userId),
  });
  console.log(result);
  return result;
}
