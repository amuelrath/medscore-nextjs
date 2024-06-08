"use client";
import { useForm, FormProvider } from "react-hook-form";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { ReactNode } from "react";

export function EditorFormProvider({
  children,
  defaultValues,
}: {
  children: ReactNode;
  defaultValues: FormResult | undefined;
}) {
  const methods = useForm<FormResult>({ defaultValues });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
