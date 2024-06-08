"use server";
import { db } from "@/db";

export async function verifyCode({ code }: { code: string }) {
  const dataFromFormCode = await db.query.formCodes.findFirst({
    with: {
      usersWithCode: {
        with: {
          user: true,
        },
      },
    },
    where: (f, { and, isNull, eq }) =>
      and(eq(f.code, code), isNull(f.deletedAt)),
  });

  if (!dataFromFormCode) throw new Error("Code not found.");
  if (dataFromFormCode.expiresAt < new Date()) throw new Error("Code expired.");

  return dataFromFormCode;

  // TODO: Check if the evaluator is in the program that is related to the code
}
