"use server";
import { db } from "@/db";
import { forms, questions, options, milestonesOnQuestions } from "@/db/schema";
import { TFormRelate } from "@/db/types";
import { and, eq, notInArray } from "drizzle-orm";

export async function saveForm(form: TFormRelate) {
  const result = await db.transaction(async (tx) => {
    // Update the form
    const formInDb = await tx
      .update(forms)
      .set({ title: form.title })
      .where(eq(forms.id, form.id))
      .returning();

    if (!formInDb || formInDb.length === 0) {
      throw new Error(`Form with ID ${form.id} not found!`);
    }

    // Delete questions that are in the DB but not in the form (hard delete)
    if (form.questions.length > 0) {
      const deleteResult = await tx.delete(questions).where(
        and(
          eq(questions.formId, form.id),
          notInArray(
            questions.id,
            form.questions.map((fq) => fq.id)
          )
        )
      );
    } else {
      const deleteResult = await tx
        .delete(questions)
        .where(eq(questions.formId, form.id));
    }

    // Insert or update questions
    await Promise.all(
      form.questions.map(async (question) => {
        const questionInDb = await tx
          .insert(questions)
          .values({
            id: question.id,
            formId: form.id,
            text: question.text,
            feedback: question.feedback,
            position: question.position,
          })
          .onConflictDoUpdate({
            target: questions.id,
            set: {
              text: question.text,
              feedback: question.feedback,
              position: question.position,
            },
          })
          .returning();

        if (!questionInDb || questionInDb.length === 0) {
          throw new Error(`Question with ID ${question.id} not found!`);
        }

        await Promise.all([
          // Delete milestones that are in the DB but not in the form
          question.milestones?.length
            ? tx.delete(milestonesOnQuestions).where(
                and(
                  eq(milestonesOnQuestions.questionId, question.id),
                  notInArray(
                    milestonesOnQuestions.milestoneId,
                    question.milestones.map((m) => m.milestoneId)
                  )
                )
              )
            : Promise.resolve(),

          // Insert or update milestones
          ...(question.milestones?.map((milestone) =>
            tx
              .insert(milestonesOnQuestions)
              .values({
                milestoneId: milestone.milestoneId,
                questionId: question.id,
              })
              .onConflictDoUpdate({
                target: [
                  milestonesOnQuestions.milestoneId,
                  milestonesOnQuestions.questionId,
                ],
                set: {
                  milestoneId: milestone.milestoneId,
                  questionId: question.id,
                },
              })
          ) ?? []),
          // Delete options that are in the DB but not in the form
          question.options?.length
            ? (async () => {
                const deleteResult = await tx.delete(options).where(
                  and(
                    eq(options.questionId, question.id),
                    notInArray(
                      options.id,
                      question.options.map((o) => o.id)
                    )
                  )
                );
              })()
            : (async () => {
                const deleteResult = await tx
                  .delete(options)
                  .where(eq(options.questionId, question.id));
              })(),

          // Insert or update options
          ...(question.options?.map((option) =>
            tx
              .insert(options)
              .values({
                id: option.id,
                questionId: question.id,
                text: option.text,
                position: option.position,
                pointValue: option.pointValue,
              })
              .onConflictDoUpdate({
                target: options.id,
                set: {
                  text: option.text,
                  position: option.position,
                  pointValue: option.pointValue,
                },
              })
          ) ?? []),
        ]);
      })
    );
  });

  return result;
}
