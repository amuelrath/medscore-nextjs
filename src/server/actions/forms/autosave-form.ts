"use server";

import { db } from "@/db";
import { forms, formItems, options, milestonesOnFormItems } from "@/db/schema";
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
    await tx
      .update(forms)
      .set({ title: formData.title })
      .where(eq(forms.id, formData.id));

    // Get existing formItems
    const existingQuestions = await tx.query.formItems.findMany({
      where: eq(formItems.formId, formData.id),
      with: {
        options: true,
        milestones: true,
      },
    });

    // Create a set of current question IDs for faster lookup
    const currentQuestionIds = new Set(formData.formItems.map((q) => q.id));

    // Delete formItems that no longer exist
    for (const existingQuestion of existingQuestions) {
      if (!currentQuestionIds.has(existingQuestion.id)) {
        await tx.delete(formItems).where(eq(formItems.id, existingQuestion.id));
      }
    }

    // Update or insert formItems
    for (let i = 0; i < formData.formItems.length; i++) {
      const questionData = formData.formItems[i];
      const existingQuestion = existingQuestions.find(
        (q) => q.id === questionData.id,
      );

      if (existingQuestion) {
        // Update existing question
        await tx
          .update(formItems)
          .set({
            text: questionData.text,
            type: questionData.type,
            position: i + 1, // Update position based on array index
            description: questionData.description,
            isRequired:
              questionData.type !== "HEADER" ? questionData.isRequired : false,
            isScored:
              questionData.type !== "HEADER" ? questionData.isScored : false,
          })
          .where(eq(formItems.id, questionData.id));

        // Handle options
        await handleOptions(
          tx,
          questionData.id,
          questionData.isScored,
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
          .insert(formItems)
          .values({
            id: questionData.id,
            formId: formData.id,
            type: questionData.type,
            text: questionData.text,
            description: questionData.description,
            position: i + 1, // Set position based on array index
            isRequired:
              questionData.type !== "HEADER" ? questionData.isRequired : false,
            isScored:
              questionData.type !== "HEADER" ? questionData.isScored : false,
          })
          .returning();

        // Insert new options
        await handleOptions(
          tx,
          newQuestion.id,
          newQuestion.isScored,
          questionData.options,
          [],
        );

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
  isScored: boolean,
  newOptions: TFormSchema["formItems"][0]["options"],
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
  for (const newOption of newOptions ) {
    if (existingOptionIds.has(newOption.id)) {
      // Update existing option
      await tx
        .update(options)
        .set({
          text: newOption.text,
          position: newOption.position,
          pointValue: isScored ? String(newOption.pointValue) : null,
        })
        .where(eq(options.id, newOption.id));
    } else {
      // Insert new option
      await tx.insert(options).values({
        id: newOption.id,
        formItemId: questionId,
        text: newOption.text,
        isNa: newOption.isNa,
        position: newOption.position,
        pointValue: isScored ? String(newOption.pointValue) : null,
      });
    }
  }
}

async function handleMilestones(
  tx: Transaction,
  formItemId: string,
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
      .insert(milestonesOnFormItems)
      .values(
        milestonesToAdd.map((milestoneId) => ({ formItemId, milestoneId })),
      );
  }

  if (milestonesToRemove.length > 0) {
    await tx
      .delete(milestonesOnFormItems)
      .where(
        and(
          eq(milestonesOnFormItems.formItemId, formItemId),
          inArray(milestonesOnFormItems.milestoneId, milestonesToRemove),
        ),
      );
  }
}
