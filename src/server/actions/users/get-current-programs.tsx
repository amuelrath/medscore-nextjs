"use server";
import { db } from "@/db";

export async function getCurrentPrograms(userId: string) {
  return db.query.usersOnPrograms.findMany({
    columns: {
      userId: false,
      programId: false,
    },
    with: {
      program: true,
    },
    where: (program, { eq }) => eq(program.userId, userId),
  });
}
