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
    await db
      .update(formCodes)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(formCodes.id, formCodeId),
          isNull(formCodes.deletedAt),
          sql`${formCodes.expiresAt} > ${now}::timestamp`,
        ),
      );

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
