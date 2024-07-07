"use server";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { administerForm } from "@/server/actions/forms/administer-form";

export async function startDirectObservation({
  formId,
  userIds,
  expiresAt,
  startsAt,
  title,
  creatorId,
}: {
  formId: string | undefined;
  userIds: string[];
  startsAt: Date;
  expiresAt: Date;
  title: string;
  creatorId: string;
}) {
  console.log("Starting direct observation with params:", {
    formId,
    userIds,
    expiresAt,
    startsAt,
    title,
    creatorId,
  });

  try {
    return await db.transaction(async (trx) => {
      const formCode = await administerForm({
        title,
        startsAt,
        expiresAt,
        userIds,
        formId,
        isDirectObservation: true,
      });

      const { id: formCodeId } = formCode;

      const response = await trx
        .insert(responses)
        .values({ formCodeId, creatorId, evaluateeId: userIds[0] })
        .returning();

      return { response: response[0], formCode };
    });
  } catch (error) {
    console.error("Error in startDirectObservation:", error);
    throw error;
  }
}
