"use server";
import { db } from "@/db";
import { dateToSQLDate } from "@/lib/helpers/date-to-sql-date";
import { sql } from "drizzle-orm";
import { formCodes, responses } from "@/db/schema";

export async function verifyCode({
  code,
  creatorId,
}: {
  code: string;
  creatorId: string;
}) {
  const now = dateToSQLDate(new Date());
  const result = await db.query.formCodes.findFirst({
    with: {
      usersWithCode: {
        with: {
          user: {
            columns: {
              role: true,
              lastName: true,
              email: false,
              password: false,
              id: true,
              firstName: true,
            },
          },
        },
      },
    },
    where: (f, { and, isNull, eq }) =>
      and(
        eq(f.code, code),
        isNull(f.canceledAt),
        sql`${formCodes.expiresAt} > ${now}::timestamp`,
        sql`${formCodes.startsAt} < ${now}::timestamp`,
      ),
  });

  if (!result) throw new Error("Code couldn't be verified");

  const response = await db
    .insert(responses)
    .values({ formCodeId: result.id, creatorId: creatorId })
    .returning();

  return { formCode: result, response: response[0] };

  // TODO: Check if the evaluator is in the program that is related to the code
  // TODO: Maybe allow admin to select evaluators
}

export type VerifyCodeResult = Awaited<ReturnType<typeof verifyCode>>;
