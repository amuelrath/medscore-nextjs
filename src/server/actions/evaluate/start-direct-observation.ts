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
    const result = await db.transaction(async (trx) => {
      console.log("Transaction started");

      const formCode = await administerForm({
        title,
        startsAt,
        expiresAt,
        userIds,
        formId,
        isDirectObservation: true,
      });
      console.log("Form code created:", formCode);

      const { id: formCodeId } = formCode;

      console.log("Attempting to create response with:", {
        formCodeId,
        creatorId,
        evaluateeId: userIds[0],
      });
      const response = await trx
        .insert(responses)
        .values({ formCodeId, creatorId, evaluateeId: userIds[0] })
        .returning();
      console.log("Response created:", response);

      return { response: response[0], formCode };
    });

    console.log("Transaction completed successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in startDirectObservation:", error);
    throw error;
  }
}
