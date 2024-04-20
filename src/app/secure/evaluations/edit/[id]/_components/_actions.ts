"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import {
  milestonesOnQuestions,
  options,
  formVersions,
  questions,
} from "@/db/schema";
import { ExtractTablesWithRelations, sql } from "drizzle-orm";
import { VersionedEvaluation } from "@/db/client-types";
import { ROUTES } from "@/lib/routes.generated";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { PgTransaction } from "drizzle-orm/pg-core";

const createNewVersion = async (
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    typeof import("c:/Users/austi/medscore-nextjs/src/db/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/austi/medscore-nextjs/src/db/schema")
    >
  >,
  evaluation: VersionedEvaluation,
  thisVersion: number
) => {
  await tx.insert(formVersions).values({
    formId: evaluation.id,
    versionNumber: thisVersion + 1,
  });

  for (const q of evaluation.questions) {
    await tx.insert(questions).values({
      id: q.id,
      text: q.text,
      versionNumber: thisVersion + 1,
      formId: evaluation.id,
      position: q.position,
      feedback: q.feedback,
    });

    for (const o of q.options) {
      await tx.insert(options).values({
        id: o.id,
        text: o.text,
        questionId: q.id,
        versionNumber: thisVersion + 1,
      });
    }

    for (const m of q.milestones) {
      await tx.insert(milestonesOnQuestions).values({
        questionId: q.id,
        milestoneId: m.milestoneId,
        versionNumber: thisVersion + 1,
      });
    }
  }
};

const updateExistingVersion = async (
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    typeof import("c:/Users/austi/medscore-nextjs/src/db/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/austi/medscore-nextjs/src/db/schema")
    >
  >,
  evaluation: VersionedEvaluation,
  thisVersion: number
) => {
  for (const q of evaluation.questions) {
    await tx
      .insert(questions)
      .values({
        id: q.id,
        text: q.text,
        versionNumber: thisVersion,
        formId: evaluation.id,
        position: q.position,
        feedback: q.feedback,
      })
      .onConflictDoUpdate({
        target: questions.id,
        set: {
          text: q.text,
          position: q.position,
          feedback: q.feedback,
        },
      });

    for (const o of q.options) {
      await tx
        .insert(options)
        .values({
          id: o.id,
          text: o.text,
          questionId: q.id,
          position: o.position,
          pointValue: o.pointValue,
        })
        .onConflictDoUpdate({
          target: options.id,
          set: {
            text: o.text,
            position: o.position,
            pointValue: o.pointValue,
          },
        });
    }

    for (const m of q.milestones) {
      await tx
        .insert(milestonesOnQuestions)
        .values({
          questionId: q.id,
          milestoneId: m.milestoneId,
          versionNumber: thisVersion,
        })
        .onConflictDoUpdate({
          target: [
            milestonesOnQuestions.questionId,
            milestonesOnQuestions.milestoneId,
          ],
          set: {
            milestoneId: m.milestoneId,
            versionNumber: thisVersion,
            questionId: q.id,
          },
        });
    }
  }
};

export const saveEvaluation = async (data: VersionedEvaluation) => {
  const evaluation = data;
  const thisVersion = data.versions.reduce((prev, cur) => {
    return cur.versionNumber > prev ? cur.versionNumber : prev;
  }, 0);

  await db.transaction(async (tx) => {
    const newestVersion = await tx.query.formVersions.findMany({
      where: (versions, { and, eq }) =>
        and(
          eq(versions.formId, evaluation.id),
          sql`${versions.versionNumber} < ${thisVersion}`
        ),
    });

    if (!newestVersion) {
      throw new Error(
        "You are trying to modify an outdated evaluation! Please refresh the page to see the newest version."
      );
    }

    const formHasResponses = await tx.query.responses.findFirst({
      where: (responses, { and, eq }) =>
        and(
          eq(responses.versionNumber, thisVersion),
          eq(responses.formId, evaluation.id)
        ),
    });

    if (formHasResponses) {
      await createNewVersion(tx, evaluation, thisVersion);
    } else {
      await updateExistingVersion(tx, evaluation, thisVersion);
    }
  });

  revalidatePath(ROUTES.SECURE.EVALUATIONS.HOME);
};
