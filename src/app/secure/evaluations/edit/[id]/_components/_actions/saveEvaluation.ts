"use server";
import { db } from "@/db";
import { forms, milestonesOnQuestions, options, questions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ClientForm } from "@/db/client-types";

// consider not making this a transaction.
export async function saveEvaluation(form: ClientForm) {
  await db.transaction(async (tx) => {
    // first update the form
    await tx
      .update(forms)
      .set({
        title: form.title,
      })
      .where(eq(forms.id, form.id));

    // get the pre-update form questions
    const oldQuestions = await tx.query.questions.findMany({
      where: (q, { and, eq, isNull }) =>
        and(
          eq(q.formId, form.id),
          eq(q.version, form.version),
          isNull(q.deletedAt)
        ),
      with: {
        options: true,
        milestones: true,
      },
    });

    // delete things
    oldQuestions.forEach(async (oq) => {
      // if a question IS IN old but NOT IN new, it was deleted
      const thisQuestionInForm = form.questions.find((q) => q.id === oq.id);
      if (!form.questions.find((nq) => nq.id === oq.id)) {
        await tx
          .delete(questions)
          .where(
            and(eq(questions.id, oq.id!), eq(questions.version, form.version))
          );
      }

      // if an option IS IN old but NOT IN new, it was DELETED
      oq.options.forEach(async (oo) => {
        if (!thisQuestionInForm?.options.find((o) => o.id === oo.id)) {
          await tx
            .delete(options)
            .where(
              and(eq(options.id, oo.id!), eq(options.version, form.version))
            );
        }
      });

      // if a milestone IS IN old but NOT IN new, it was DELETED
      oq.milestones.forEach(async (om) => {
        if (
          !thisQuestionInForm?.milestones.find(
            (m) => m.milestoneId === om.milestoneId
          )
        ) {
          await tx
            .delete(milestonesOnQuestions)
            .where(
              and(
                eq(milestonesOnQuestions.questionId, oq.id!),
                eq(milestonesOnQuestions.milestoneId, om.milestoneId),
                eq(milestonesOnQuestions.version, form.version)
              )
            );
        }
      });
    });

    // update questions
    for (const q of form.questions) {
      await tx
        .insert(questions)
        .values({
          id: q.id,
          text: q.text,
          feedback: q.feedback,
          formId: form.id,
          version: form.version,
          position: q.position,
          deletedAt: q.deletedAt,
        })
        .onConflictDoUpdate({
          target: [questions.id, questions.version],
          set: {
            text: q.text,
            version: form.version,
            feedback: q.feedback,
            position: q.position,
          },
        });

      // update options
      for (const o of q.options) {
        await tx
          .insert(options)
          .values({
            id: o.id,
            text: o.text,
            position: o.position,
            version: form.version,
            questionId: q.id!,
            pointValue: o.pointValue,
          })
          .onConflictDoUpdate({
            target: [options.id, options.version],
            set: {
              text: o.text,
              version: form.version,
              position: o.position,
              pointValue: o.pointValue,
            },
          });
      }

      // update milestones
      // MARK: fix: milestones are actually an array of strings
      for (const m of q.milestones) {
        await tx
          .insert(milestonesOnQuestions)
          .values({
            milestoneId: m.milestoneId,
            questionId: q.id!,
            version: form.version,
          })
          .onConflictDoUpdate({
            target: [
              milestonesOnQuestions.milestoneId,
              milestonesOnQuestions.questionId,
              milestonesOnQuestions.version,
            ],
            set: {
              milestoneId: m.milestoneId,
              questionId: q.id!,
              version: form.version,
            },
          });
      }
    }
  });
}
