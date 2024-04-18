"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import {
  evaluations,
  feedback,
  milestonesOnQuestions,
  options,
  questions,
} from "@/db/schema";
import { and, eq, not, inArray } from "drizzle-orm";
import { EvaluationFormData } from "@/db/client-types";
import { ROUTES } from "@/lib/routes.generated";

export const saveEvaluation = async (data: EvaluationFormData) => {
  const formEvaluation = data;

  await db.transaction(async (tx) => {
    // Upsert evaluation
    await tx
      .insert(evaluations)
      .values({
        id: formEvaluation.id,
        programId: formEvaluation.programId,
        title: formEvaluation.title,
        creatorId: process.env.DEV_USER_ID!, // TODO SESSION DATA
      })
      .onConflictDoUpdate({
        target: evaluations.id,
        set: {
          title: formEvaluation.title,
          programId: formEvaluation.programId,
        },
      });

    // Delete stale questions
    const questionIds = formEvaluation.questions.map((q) => q.id);
    await tx
      .delete(questions)
      .where(
        and(
          eq(questions.evaluationId, formEvaluation.id),
          not(inArray(questions.id, questionIds))
        )
      );

    // Upsert questions
    for (const q of formEvaluation.questions) {
      await tx
        .insert(questions)
        .values({
          id: q.id,
          text: q.text,
          feedback: q.feedback,
          evaluationId: formEvaluation.id,
        })
        .onConflictDoUpdate({
          target: questions.id,
          set: {
            text: q.text,
            feedback: q.feedback,
          },
        });

      // Delete all stale allocations and replace with new ones
      await tx
        .delete(milestonesOnQuestions)
        .where(eq(milestonesOnQuestions.questionId, q.id));

      // Insert new milestoneOnQuestions allocations
      for (const mId of q.milestoneIds) {
        await tx.insert(milestonesOnQuestions).values({
          questionId: q.id,
          milestoneId: mId,
        });
      }

      // Delete stale options
      const optionIds = q.options.map((o) => o.id);
      if (optionIds.length > 0) {
        await tx
          .delete(options)
          .where(
            and(
              eq(options.questionId, q.id),
              not(inArray(options.id, optionIds))
            )
          );
      }

      // Upsert options
      for (const o of q.options) {
        await tx
          .insert(options)
          .values({
            id: o.id,
            text: o.text,
            pointValue: o.pointValue.toString(),
            questionId: q.id,
          })
          .onConflictDoUpdate({
            target: options.id,
            set: {
              text: o.text,
              pointValue: o.pointValue.toString(),
            },
          });
      }
    }
  });

  revalidatePath(ROUTES.SECURE.EVALUATIONS.HOME.toString());
};
