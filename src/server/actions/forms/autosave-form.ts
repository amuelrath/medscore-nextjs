"use server";

import { db } from "@/db";
import { forms, questions, options, milestonesOnQuestions } from "@/db/schema";
import { and, eq, ExtractTablesWithRelations, inArray } from "drizzle-orm";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("C:/Users/Austin Muelrath/medscore-nextjs/src/db/schema"),
  ExtractTablesWithRelations<
    typeof import("C:/Users/Austin Muelrath/medscore-nextjs/src/db/schema")
  >
>;
export async function autosaveForm(formData: TFormSchema) {
  return db.transaction(async (tx) => {
    // Update form title
    const now = new Date()
    await tx
      .update(forms)
      .set({ title: formData.title})
      .where(eq(forms.id, formData.id));

    // Get existing questions
    const existingQuestions = await tx.query.questions.findMany({
      where: eq(questions.formId, formData.id),
      with: {
        options: true,
        milestones: true,
      },
    });

    // Create a set of current question IDs for faster lookup
    const currentQuestionIds = new Set(formData.questions.map((q) => q.id));

    // Delete questions that no longer exist
    for (const existingQuestion of existingQuestions) {
      if (!currentQuestionIds.has(existingQuestion.id)) {
        await tx.delete(questions).where(eq(questions.id, existingQuestion.id));
      }
    }

    // Update or insert questions
    for (let i = 0; i < formData.questions.length; i++) {
      const questionData = formData.questions[i];
      const existingQuestion = existingQuestions.find(
        (q) => q.id === questionData.id,
      );

      if (existingQuestion) {
        // Update existing question
        await tx
          .update(questions)
          .set({
            text: questionData.text,
            position: i + 1, // Update position based on array index
            feedback: questionData.feedback,
          })
          .where(eq(questions.id, questionData.id));

        // Handle options
        await handleOptions(
          tx,
          questionData.id,
          questionData.options,
          existingQuestion.options,
        );

        // Handle milestones
        await handleMilestones(
          tx,
          questionData.id,
          questionData.milestoneIds,
          existingQuestion.milestones,
        );
      } else {
        // Insert new question
        const [newQuestion] = await tx
          .insert(questions)
          .values({
            id: questionData.id,
            formId: formData.id,
            text: questionData.text,
            position: i + 1, // Set position based on array index
            feedback: questionData.feedback,
          })
          .returning();

        // Insert new options
        await handleOptions(tx, newQuestion.id, questionData.options, []);

        // Insert new milestones
        await handleMilestones(
          tx,
          newQuestion.id,
          questionData.milestoneIds,
          [],
        );
      }
    }
  });
}

async function handleOptions(
  tx: Transaction,
  questionId: string,
  newOptions: TFormSchema["questions"][0]["options"],
  existingOptions: (typeof options.$inferSelect)[],
) {
  const newOptionIds = new Set(newOptions.map((o) => o.id));
  const existingOptionIds = new Set(existingOptions.map((o) => o.id));

  // Delete options that are no longer present
  for (const existingOption of existingOptions) {
    if (!newOptionIds.has(existingOption.id)) {
      await tx.delete(options).where(eq(options.id, existingOption.id));
    }
  }

  // Update or insert options
  for (const newOption of newOptions) {
    if (existingOptionIds.has(newOption.id)) {
      // Update existing option
      await tx
        .update(options)
        .set({
          text: newOption.text,
          position: newOption.position,
          pointValue: newOption.pointValue,
        })
        .where(eq(options.id, newOption.id));
    } else {
      // Insert new option
      await tx.insert(options).values({
        id: newOption.id,
        questionId,
        text: newOption.text,
        position: newOption.position,
        pointValue: newOption.pointValue,
      });
    }
  }
}

async function handleMilestones(
  tx: Transaction,
  questionId: string,
  newMilestoneIds: string[] | undefined,
  existingMilestones: { milestoneId: string }[],
) {
  // Ensure newMilestoneIds is an array
  const milestoneIdsArray = Array.isArray(newMilestoneIds)
    ? newMilestoneIds
    : [];

  const existingMilestoneIds = existingMilestones.map((m) => m.milestoneId);
  const milestonesToAdd = milestoneIdsArray.filter(
    (id) => !existingMilestoneIds.includes(id),
  );
  const milestonesToRemove = existingMilestoneIds.filter(
    (id) => !milestoneIdsArray.includes(id),
  );

  if (milestonesToAdd.length > 0) {
    await tx
      .insert(milestonesOnQuestions)
      .values(
        milestonesToAdd.map((milestoneId) => ({ questionId, milestoneId })),
      );
  }

  if (milestonesToRemove.length > 0) {
    await tx
      .delete(milestonesOnQuestions)
      .where(
        and(
          eq(milestonesOnQuestions.questionId, questionId),
          inArray(milestonesOnQuestions.milestoneId, milestonesToRemove),
        ),
      );
  }
}
