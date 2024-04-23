"use server";
import { db } from "@/db";
import { formCodes, formCodesOnUsers } from "@/db/schema";

export default async function collectResponses(
  formId: string,
  version: number,
  expiresAt: Date,
  evaluateeIds: string[]
) {
  await db.transaction(async (tx) => {
    tx.insert(formCodes)
      .values({
        formId,
        version,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [formCodes.formId, formCodes.version],
        set: { expiresAt },
      });

    evaluateeIds.forEach((id) => {
      tx.insert(formCodesOnUsers).values({
        formId,
        version,
        userId: id,
      });
    });
  });
}
