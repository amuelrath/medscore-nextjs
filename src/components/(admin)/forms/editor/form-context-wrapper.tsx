"use client";
import { useFormBuilder } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { DEFAULT_FORM_SETTINGS } from "@/db/constants";
import { TFormType } from "@/db/schema";
import { ZFormSettingsSchema } from "@/lib/zod/form-schema";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { ReactNode, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { z } from "zod";

type FormSettings = z.infer<typeof ZFormSettingsSchema>;
function mergeWithDefaultSettings(
  formType: TFormType,
  partialSettings: unknown,
): FormSettings {
  try {
    const validatedPartialSettings =
      ZFormSettingsSchema.partial().parse(partialSettings);
    return {
      ...DEFAULT_FORM_SETTINGS[formType],
      ...validatedPartialSettings,
    };
  } catch (error) {
    console.error("Invalid settings provided:", error);
    return DEFAULT_FORM_SETTINGS[formType];
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
