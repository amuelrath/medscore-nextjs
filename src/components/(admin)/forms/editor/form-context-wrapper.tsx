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
      formItems: transform(defaultValues.formItems),
    }),
    [defaultValues],
  );

  // this instantiates the hook-form
  const { methods } = useFormBuilder(transformedDefaultValues);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

// for getting the formResult into hook-form readable format
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
      text: text || "", // for some reason null !== undefined. gotta love zod ts support
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
