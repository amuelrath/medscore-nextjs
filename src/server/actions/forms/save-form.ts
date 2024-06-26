"use server";
import { db } from "@/db";
import { forms, questions, milestonesOnQuestions, options } from "@/db/schema";
import { FormResult } from "@/db/types";
import { and, eq, inArray } from "drizzle-orm";

export type FormChanges = {
  id: string;
  title?: string;
  questions?: {
    added: FormResult["questions"];
    updated: FormResult["questions"];
    removed: string[];
  };
};

export async function saveFormChanges(changes: FormChanges) {
  console.log("Received changes:", JSON.stringify(changes, null, 2));

  try {
    return await db.transaction(async (tx) => {
      // Update form title if changed
      if (changes.title !== undefined) {
        await tx
          .update(forms)
          .set({ title: changes.title })
          .where(eq(forms.id, changes.id));
      }

      if (changes.questions) {
        console.log("Processing questions changes");

        // Handle removed questions
        if (changes.questions.removed && changes.questions.removed.length > 0) {
          console.log("Removing questions:", changes.questions.removed);
          await tx
            .delete(questions)
            .where(
              and(
                eq(questions.formId, changes.id),
                inArray(questions.id, changes.questions.removed),
              ),
            );
        }

        // Handle added questions
        if (changes.questions.added && changes.questions.added.length > 0) {
          console.log("Adding questions:", changes.questions.added);
          await tx.insert(questions).values(
            changes.questions.added.map((q) => ({
              id: q.id,
              formId: changes.id,
              text: q.text,
              feedback: q.feedback,
              position: q.position,
            })),
          );
        }

        // Handle updated questions
        if (changes.questions.updated && changes.questions.updated.length > 0) {
          console.log("Updating questions:", changes.questions.updated);
          for (const question of changes.questions.updated) {
            await tx
              .update(questions)
              .set({
                text: question.text,
                feedback: question.feedback,
                position: question.position,
              })
              .where(eq(questions.id, question.id));

            // Update milestones
            if (question.milestones) {
              await tx
                .delete(milestonesOnQuestions)
                .where(eq(milestonesOnQuestions.questionId, question.id));

              if (question.milestones.length > 0) {
                await tx.insert(milestonesOnQuestions).values(
                  question.milestones.map((m) => ({
                    milestoneId: m.milestoneId,
                    questionId: question.id,
                  })),
                );
              }
            }

            // Update options
            if (question.options) {
              await tx
                .delete(options)
                .where(eq(options.questionId, question.id));

              if (question.options.length > 0) {
                await tx.insert(options).values(
                  question.options.map((o) => ({
                    id: o.id,
                    questionId: question.id,
                    text: o.text,
                    position: o.position,
                    pointValue: o.pointValue,
                  })),
                );
              }
            }
          }
        }
      }

      return { success: true };
    });
  } catch (error) {
    console.error("Error in saveFormChanges:", error);
    throw error;
  }
}
