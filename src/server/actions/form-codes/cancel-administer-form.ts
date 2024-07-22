"use server";

import { db } from "@/db";
import { assessments } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { dateToSQLDate } from "@/lib/helpers/date-to-sql-date";

type CancelAdministerFormResult = {
  success: boolean;
  message: string;
  hasResponses: boolean;
};

export async function cancelAdministerForm(
  formCodeId: string,
): Promise<CancelAdministerFormResult> {
  try {
    const now = dateToSQLDate(new Date());

    // Check if the form code has any responses
    const hasResponses = await db.query.responses.findFirst({
      where: (r, { eq }) => eq(r.assessmentId, formCodeId),
    });

    if (hasResponses) {
      // If there are responses, set the canceledAt property
      await db
        .update(assessments)
        .set({
          canceledAt: new Date(),
        })
        .where(
          and(
            eq(assessments.id, formCodeId),
            isNull(assessments.canceledAt),
            sql`${assessments.expiresAt} > ${now}::timestamp`,
          ),
        );
    } else {
      // If there are no responses, delete the form code
      await db
        .delete(assessments)
        .where(
          and(
            eq(assessments.id, formCodeId),
            isNull(assessments.canceledAt),
            sql`${assessments.expiresAt} > ${now}::timestamp`,
          ),
        );
    }

    return {
      success: true,
      message: "Form administration cancelled successfully.",
      hasResponses: hasResponses !== null,
    };
  } catch (error) {
    console.error("Error cancelling form administration:", error);
    return {
      success: false,
      message: "An error occurred while cancelling form administration.",
      hasResponses: false,
    };
  }
}
