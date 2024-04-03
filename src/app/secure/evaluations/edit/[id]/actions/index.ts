"use server";
import { db } from "@/db";
import {
  evaluations,
  questions,
  milestones,
  options,
  NewOption,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NewQuestion } from "@/db/schema";
// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
// TODO RLS Policies might negate the need for checking the UserID here
export async function getEvaluation(id: string) {
  const evaluation = await db.query.evaluations.findFirst({
    where: (evaluation, { eq }) => eq(evaluation.id, id),
    with: {
      questions: {
        with: {
          options: true,
          milestones: true,
        },
      },
    },
  });

  if (!evaluation) {
    throw new Error("Evaluation not found");
  }
  if (evaluation.creatorId !== process.env.DEV_USER_ID) {
    throw new Error("Unauthorized");
  }

  return evaluation;
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function createQuestion(evaluationId: string) {
  const evaluation = await db.query.evaluations.findFirst({
    where: (evaluations, { eq }) => eq(evaluations.id, evaluationId),
  });

  if (evaluation?.creatorId !== process.env.DEV_USER_ID) {
    throw new Error("Unauthorized");
  }

  await db.insert(questions).values({
    text: "",
    evaluationId: evaluationId,
  });

  revalidatePath("page");
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function deleteQuestion(questionId: string) {
  const question = await db.query.questions.findFirst({
    where: (question, { eq }) => eq(question.id, questionId),
    with: { evaluations: true },
  });

  if (!question) throw new Error("Question not found");
  if (question.evaluations.creatorId !== process.env.DEV_USER_ID!) {
    throw new Error("Unauthorized");
  }

  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath("#");
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function createOption(questionId: string) {
  const question = await db.query.questions.findFirst({
    where: (question, { eq }) => eq(question.id, questionId),
    with: { evaluations: true },
  });

  if (!question) throw new Error("Question not found");
  if (question.evaluations?.creatorId !== process.env.DEV_USER_ID) {
    throw new Error("Unauthorized");
  }

  await db.insert(options).values({
    text: "",
    pointValue: "0",
    questionId: questionId,
  });

  revalidatePath("#");
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function deleteOption(optionId: string) {
  const option = await db.query.options.findFirst({
    where: (option, { eq }) => eq(option.id, optionId),
    with: {
      questions: { with: { evaluations: true } },
    },
  });

  if (!option) throw new Error("Option not found");

  if (option.questions.evaluations.creatorId !== process.env.DEV_USER_ID)
    throw new Error("Unauthorized");

  await db.delete(options).where(eq(options.id, optionId));
  revalidatePath("#");
}

// TODO GET ACTUAL SESSION DATA AND CHECK THIS WAY
export async function updateQuestion(
  questionId: string,
  updates: Partial<NewQuestion>
) {
  const question = await db.query.questions.findFirst({
    where: (question, { eq }) => eq(question.id, questionId),
    with: { evaluations: true },
  });

  if (!question) throw new Error("Question not found");

  if (question.evaluations.creatorId !== process.env.DEV_USER_ID!)
    throw new Error("Unauthorized");

  await db.update(questions).set(updates).where(eq(questions.id, questionId));
}

export async function updateOption(
  optionId: string,
  updates: Partial<NewOption>
) {
  const option = await db.query.options.findFirst({
    where: (option, { eq }) => eq(option.id, optionId),
    with: { questions: { with: { evaluations: true } } },
  });

  if (!option) throw new Error("Option not found");
  if (option.questions.evaluations.creatorId !== process.env.DEV_USER_ID)
    throw new Error("Unauthorized");

  await db.update(options).set(updates).where(eq(options.id, optionId));
}
