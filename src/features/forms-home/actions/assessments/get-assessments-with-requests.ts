"use server";

import { db } from "@/db";
import { dateToSQLDate } from "@/lib/date-to-sql-date";
import { sql } from "drizzle-orm";

// todo use the logged in user's id
export async function getAssessmentsWithRequests() {
  const userId = process.env.NEXT_PUBLIC_DEV_USER_ID!;
  const now = dateToSQLDate(new Date());

  return db.transaction(async (tx) => 
    // get all assessments created by me with their related responses (not full obj)
     tx.query.assessments.findMany({
      where: (a, { eq, and }) =>
        and(sql`${a.expiresAt} > ${now}::timestamp`, eq(a.creatorId, userId)),
      with: {
        form: {
          columns: {
            title: true,
            type: true,
          }
        },
        responses: {
          columns: {
            id: true,
            status: true,
            createdAt: true,
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
    })
  );
}

export type AssessmentsWithRequestsResult = NonNullable<
  Awaited<ReturnType<typeof getAssessmentsWithRequests>>
>;
