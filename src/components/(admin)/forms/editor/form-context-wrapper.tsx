"use client";
import { ReactNode, useMemo } from "react";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { useFormBuilder } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { FormProvider } from "react-hook-form";

export const FormContextWrapper = ({
  children,
  defaultValues,
}: {
  children: ReactNode;
  defaultValues: FormResult;
}) => {
  const transformedDefaultValues = useMemo(
    () => ({
      id: defaultValues.id,
      title: defaultValues.title,
      questions: transform(defaultValues.questions),
    }),
    [defaultValues],
  );

  const { methods } = useFormBuilder(transformedDefaultValues);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const transform = (questions: FormResult["questions"]) => {
  return questions.map(
    ({ id, text, milestones, position, options, feedback }) => ({
      id,
      text: text || undefined,
      milestoneIds: milestones.map((m) => m.milestoneId),
      feedback,
      position,
      options: options.map(({ id, text, position, pointValue }) => ({
        id,
        text: text || undefined,
        position,
        pointValue,
      })),
    }),
  );
};
