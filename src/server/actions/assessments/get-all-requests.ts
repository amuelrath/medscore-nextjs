"use server";
import { db } from "@/db";
import { dateToSQLDate } from "@/lib/helpers/date-to-sql-date";
import { sql } from "drizzle-orm";

// todo use the logged in user's id
export async function getAllRequests() {
  const userId = process.env.NEXT_PUBLIC_DEV_USER_ID!;
  const now = dateToSQLDate(new Date());

  return db.transaction(async (tx) => {
    // get all assessments created by me with their related responses (not full obj)
    return tx.query.assessments.findMany({
      where: (a, { eq, and }) =>
        and(sql`${a.expiresAt} > ${now}::timestamp`, eq(a.creatorId, userId)),
      with: {
        form: {
          columns: {
            title: true
          }
        },
        responses: {
          columns: {
            id: true,
            status: true,
          },
          with: {
            evaluatee: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            respondee: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  });
}

export type RequestsResult = NonNullable<
  Awaited<ReturnType<typeof getAllRequests>>
>;
