"use server";
import { db } from "@/db";
import { forms, TFormType } from "@/db/schema";
import { ZFormSettingsSchema } from "@/lib/zod/form-schema";
import { getFormLiteById } from "@/server/actions/forms/get-all-forms-lite";
import { z } from "zod";

type FormSettings = z.infer<typeof ZFormSettingsSchema>;

const DEFAULT_SETTINGS: Record<TFormType, FormSettings> = {
  OSCE: {
    administerAccess: "JUST_ME",
    editAccess: "JUST_ME",
    allowResponseRevisions: false,
    allowResponseSaveAndQuit: true,
    allowMultipleSubmissions: false,
    scoresAffectGrades: true,
    roleWeights: [],
    passingCriteria: [],
  },
  SURVEY: {
    administerAccess: "FACULTY_IN_PROGRAM",
    editAccess: "JUST_ME",
    allowResponseRevisions: true,
    allowResponseSaveAndQuit: true,
    allowMultipleSubmissions: true,
    scoresAffectGrades: false,
    roleWeights: [],
    passingCriteria: [],
  },
  DIRECT_OBSERVATION: {
    administerAccess: "FACULTY_I_CHOOSE",
    editAccess: "JUST_ME",
    allowResponseRevisions: false,
    allowResponseSaveAndQuit: false,
    allowMultipleSubmissions: true,
    scoresAffectGrades: true,
    roleWeights: [],
    passingCriteria: [],
  },
  QUIZ: {
    administerAccess: "JUST_ME",
    editAccess: "JUST_ME",
    allowResponseRevisions: false,
    allowResponseSaveAndQuit: false,
    allowMultipleSubmissions: false,
    scoresAffectGrades: true,
    roleWeights: [],
    passingCriteria: [],
  },
};

export async function createForm({
  title,
  programId,
  type,
}: {
  title: string;
  programId: string;
  type: TFormType;
}) {
  const defaultSettings = DEFAULT_SETTINGS[type];

  const [insertedForm] = await db.transaction(async (tx) => {
    const [form] = await tx
      .insert(forms)
      .values({
        title,
        programId,
        settings: defaultSettings,
        type,
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      })
      .returning();

    return [form];
  });

  return getFormLiteById({ formId: insertedForm.id });
}
