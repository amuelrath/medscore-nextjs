"use client";
import { useFormBuilder } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { ZFormSettingsSchema } from "@/lib/zod/form-schema";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { ReactNode, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { z } from "zod";

type FormType = "OSCE" | "SURVEY" | "DIRECT_OBSERVATION" | "QUIZ";
type FormSettings = z.infer<typeof ZFormSettingsSchema>;

const DEFAULT_SETTINGS: Record<FormType, FormSettings> = {
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

function mergeWithDefaultSettings(
  formType: FormType,
  partialSettings: unknown,
): FormSettings {
  try {
    const validatedPartialSettings =
      ZFormSettingsSchema.partial().parse(partialSettings);
    return {
      ...DEFAULT_SETTINGS[formType],
      ...validatedPartialSettings,
    };
  } catch (error) {
    console.error("Invalid settings provided:", error);
    return DEFAULT_SETTINGS[formType];
  }
}

const transform = (formItems: FormResult["formItems"]) => {
  return formItems.map(
    ({
      id,
      text,
      position,
      milestones,
      type,
      isRequired,
      description,
      options,
      isScored,
    }) => ({
      id,
      text: text || "",
      type,
      isRequired: !!isRequired,
      isScored,
      description,
      milestoneIds: milestones.map((m) => m.milestoneId),
      position,
      options: options.map(({ id, text, position, pointValue, isNa }) => ({
        id,
        text,
        position,
        isNa,
        pointValue,
      })),
    }),
  );
};

export const FormContextWrapper = ({
  children,
  defaultValues,
}: {
  children: ReactNode;
  defaultValues: FormResult;
}) => {
  const transformedDefaultValues = useMemo(() => {
    const mergedSettings = mergeWithDefaultSettings(
      defaultValues.type,
      defaultValues.settings,
    );

    return {
      id: defaultValues.id,
      title: defaultValues.title,
      type: defaultValues.type,
      settings: mergedSettings,
      formItems: transform(defaultValues.formItems),
    };
  }, [defaultValues]);

  const { methods } = useFormBuilder(transformedDefaultValues);

  return <FormProvider {...methods}>{children}</FormProvider>;
};
