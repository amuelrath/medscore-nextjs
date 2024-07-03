"use server";

import { db } from "@/db";
import { formCodes } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { dateToSQLDate } from "@/lib/date-to-sql-date";

type CancelAdministerFormResult = {
  success: boolean;
  message: string;
};

export async function cancelAdministerForm({
  formCodeId,
}: {
  formCodeId: string;
}): Promise<CancelAdministerFormResult> {
  try {
    const now = dateToSQLDate(new Date());

    // Check if the form code has any responses
    const hasResponses = await db.query.responses.findFirst({
      where: (r, { eq }) => eq(r.formCodeId, formCodeId),
    });

    if (hasResponses) {
      // If there are responses, set the canceledAt property
      await db
        .update(formCodes)
        .set({
          canceledAt: new Date(),
        })
        .where(
          and(
            eq(formCodes.id, formCodeId),
            isNull(formCodes.canceledAt),
            sql`${formCodes.expiresAt} > ${now}::timestamp`,
          ),
        );
    } else {
      // If there are no responses, delete the form code
      await db
        .delete(formCodes)
        .where(
          and(
            eq(formCodes.id, formCodeId),
            isNull(formCodes.canceledAt),
            sql`${formCodes.expiresAt} > ${now}::timestamp`,
          ),
        );
    }

    return {
      success: true,
      message: "Form administration cancelled successfully.",
    };
  } catch (error) {
    console.error("Error cancelling form administration:", error);
    return {
      success: false,
      message: "An error occurred while cancelling form administration.",
    };
  }
}
