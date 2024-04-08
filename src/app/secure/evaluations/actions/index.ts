"use server";
import { db } from "@/db";
import {
  NewEvaluation,
  evaluations,
  milestonesOnQuestions,
  options,
  publishedEvaluations,
  publishedMilestonesOnQuestions,
  publishedOptions,
  publishedQuestions,
  questions,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// TODO GET ACTUAL USER DATA FROM SESSION
export async function createEvaluation(data: FormData) {
  const title = data.get("title");
  const description = data.get("description");

  const programIdQuery = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, process.env.DEV_USER_ID!),
    columns: { id: true },
    with: {
      programs: true,
    },
  });

  if (!programIdQuery) throw new Error("Program not found");
  const programId = programIdQuery?.programs?.id;
  if (!programId) throw new Error("Program not found");

  const insertEvaluation = async (data: NewEvaluation) => {
    return db.insert(evaluations).values(data);
  };

  const newEvaluation: NewEvaluation = {
    title: title as string,
    description: description as string,
    programId: programId,
    creatorId: process.env.DEV_USER_ID!,
  };

  await insertEvaluation(newEvaluation);
  revalidatePath("#"); // could be an issue
}

export const deleteEvaluation = async (evaluationId: string) => {
  await db.delete(evaluations).where(eq(evaluations.id, evaluationId));
  revalidatePath("#");
};

export const publishEvaluation = async (evaluationId: string) => {
  // Retrieve the evaluation by id
  const evaluation = await db.query.evaluations.findFirst({
    where: (evaluation, { eq }) => eq(evaluation.id, evaluationId),
  });

  if (!evaluation) {
    throw new Error("Evaluation not found");
  }

  // Insert the evaluation into the publishedEvaluations table
  const publishedEvaluation = await db
    .insert(publishedEvaluations)
    .values({
      title: evaluation.title,
      description: evaluation.description,
      programId: evaluation.programId,
      creatorId: evaluation.creatorId,
    })
    .returning()
    .execute();

  if (!publishedEvaluation) throw new Error("Evaluation publish failed");

  // Retrieve the questions for the evaluation
  const evalQuestions = await db.query.questions.findMany({
    where: eq(questions.evaluationId, evaluationId),
  });

  // Retrieve the options for the questions
  for (const question of evalQuestions) {
    const publishedQuestion = await db
      .insert(publishedQuestions)
      .values({
        text: question.text,
        publishedEvaluationId: publishedEvaluation[0].id,
        position: question.position,
      })
      .returning()
      .execute();

    // Retrieve the options for the questions
    const questionOptions = await db.query.options.findMany({
      where: eq(options.questionId, question.id),
    });

    for (const option of questionOptions) {
      await db
        .insert(publishedOptions)
        .values({
          text: option.text,
          publishedQuestionId: publishedQuestion[0].id,
        })
        .execute();
    }

    // Retrieve the milestones for the questions
    const questionAllocations = await db.query.milestonesOnQuestions.findMany({
      where: eq(milestonesOnQuestions.questionId, question.id),
    });

    for (const allocation of questionAllocations) {
      await db
        .insert(publishedMilestonesOnQuestions)
        .values({
          milestoneId: allocation.milestoneId,
          publishedQuestionId: publishedQuestion[0].id,
        })
        .execute();
    }
  }
};
