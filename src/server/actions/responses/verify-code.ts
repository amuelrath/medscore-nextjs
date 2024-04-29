"use server";
import { db } from "@/db";

export async function verifyCode(code: string) {
  const formCode = await db.query.formCodes.findFirst({
    with: {
      usersWithCode: true,
    },
    where: (f, { and, isNull, eq }) =>
      and(eq(f.code, code), isNull(f.deletedAt)),
  });

  if (!formCode) throw new Error("Code not found.");
  if (formCode.expiresAt < new Date()) throw new Error("Code expired.");

  return formCode;

  // TODO: Check if the evaluator is in the program that is related to the code
}
