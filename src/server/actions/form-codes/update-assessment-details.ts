"use server";
import { db } from "@/db";
import { assessments, assessmentsOnEvaluatees } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  assessmentId: string;
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
  const { title, evaluateeIds, assessmentId } = params;
  const startsAt = new Date(params.startsAt);
  const expiresAt = new Date(params.expiresAt);

  try {
    const result = await db.transaction(async (tx) => {
      // update the form code itself
      await tx
        .update(assessments)
        .set({ title, startsAt, expiresAt })
        .where(eq(assessments.id, assessmentId));

      // delete existing user associations
      await tx
        .delete(assessmentsOnEvaluatees)
        .where(eq(assessmentsOnEvaluatees.assessmentId, assessmentId));

      // insert new user associations
      for (const userId of evaluateeIds) {
        await tx.insert(assessmentsOnEvaluatees).values({ assessmentId: assessmentId, userId });
      }

      return {
        id: assessmentId,
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
