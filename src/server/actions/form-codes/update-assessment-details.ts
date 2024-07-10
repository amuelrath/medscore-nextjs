"use server";
import { db } from "@/db";
import { formCodes, formCodesOnUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  formCodeId: string;
  title: string;
  evaluateeIds: string[];
  startsAt: string;
  expiresAt: string;
}

type FormCodeResult = {
  id: string;
  title: string;
  expiresAt: string;
  startsAt: string;
  evaluateeIds: string[];
};

type Result = SuccessResult | ErrorResult;

type SuccessResult = {
  status: "success";
  data: FormCodeResult;
};

type ErrorResult = {
  status: "error";
  message: string;
};

export async function updateAssessmentDetails({
  ...params
}: Params): Promise<Result> {
  const { title, evaluateeIds, formCodeId } = params;
  const startsAt = new Date(params.startsAt);
  const expiresAt = new Date(params.expiresAt);

  try {
    const result = await db.transaction(async (tx) => {
      // update the form code itself
      await tx
        .update(formCodes)
        .set({ title, startsAt, expiresAt })
        .where(eq(formCodes.id, formCodeId));

      // delete existing user associations
      await tx
        .delete(formCodesOnUsers)
        .where(eq(formCodesOnUsers.formCodeId, formCodeId));

      // insert new user associations
      for (const userId of evaluateeIds) {
        await tx.insert(formCodesOnUsers).values({ formCodeId, userId });
      }

      return {
        id: formCodeId,
        title,
        startsAt: startsAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        evaluateeIds,
      };
    });

    return { status: "success", data: result };
  } catch (error) {
    console.error("Error updating assessment details:", error);
    return { status: "error", message: "Failed to update assessment details" };
  }
}
