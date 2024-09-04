"use client";

import { isSavingAtom } from "@/components/(admin)/forms/editor/atoms";
import { ZFormItemsSchema, ZFormSettingsSchema } from "@/lib/zod/form-schema";
import { autosaveForm } from "@/server/actions/forms/autosave-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { isEqual } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";

export const ZFormSchema = z
  .object({
    id: z.string(),
    type: z.enum(["OSCE", "SURVEY", "DIRECT_OBSERVATION", "EVALUATION"]),
    title: z.string().min(1, "Title is required"),
    settings: ZFormSettingsSchema,
    formItems: ZFormItemsSchema,
  })
  .refine(
    (data) => {
      const headerItems = data.formItems.filter((fi) => fi.type === "HEADER");
      return headerItems.every(
        (hi) =>
          hi.milestoneIds.length === 0 &&
          hi.options.length === 0 &&
          !hi.isRequired,
      );
    },
    {
      message:
        "Header items must not have milestones, options, or be required.",
      path: ["formItems"],
    },
  )
  .refine(
    (data) => {
      const writtenItems = data.formItems.filter((fi) => fi.type === "WRITTEN");
      return writtenItems.every((fi) => fi.options.length === 0);
    },
    {
      message: "Written questions must not have options.",
      path: ["formItems"],
    },
  )
  .refine(
    (data) => {
      const nonHeaderItems = data.formItems.filter(
        (fi) => fi.type !== "HEADER",
      );
      return nonHeaderItems.every((fi) => fi.description === null || undefined);
    },
    {
      message: "Only header items can have descriptions.",
      path: ["formItems"],
    },
  );

export type TFormSchema = z.infer<typeof ZFormSchema>;

export const useFormBuilder = (initialData?: TFormSchema) => {
  const methods = useForm<TFormSchema>({
    resolver: zodResolver(ZFormSchema),
    defaultValues: initialData?.formItems.length
      ? initialData
      : {
        id: initialData?.id ?? v4(),
        title: initialData?.title ?? "",
        type: initialData?.type ?? "SURVEY",
        settings: initialData?.settings ?? {},
        formItems: [
          {
            id: v4(),
            text: initialData?.title ?? "New Form",
            type: "HEADER",
            description: null,
            position: 1,
            isRequired: false,
            isScored: false,
            milestoneIds: [],
            options: [],
          },
        ],
      },
  });

  const [isSaving, setIsSaving] = useAtom(isSavingAtom);
  const previousStateRef = useRef<TFormSchema | null>(null);
  // eslint-disable-next-line no-undef
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const latestFormDataRef = useRef<TFormSchema | null>(null);

  const handleSave = useCallback(async (formData: TFormSchema) => {
    try {
      setIsSaving(true);
      await autosaveForm(formData);
    } catch (error) {
      toast.error("Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  }, [setIsSaving]);

  const debouncedSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (latestFormDataRef.current) {
        try {
          const validatedData = ZFormSchema.parse(latestFormDataRef.current);
          handleSave(validatedData).catch(() => toast.error("Error saving form."));
        } catch (error) {
          console.error("Form validation error:", error);
          toast.error("Form validation failed. Please check your inputs.");
        }
      }
    }, 2000); // Max delay of 2000ms
  }, [handleSave]);

  useEffect(() => {
    const subscription = methods.watch((formData) => {
      if (!isEqual(formData, previousStateRef.current)) {
        latestFormDataRef.current = formData as TFormSchema;
        previousStateRef.current = JSON.parse(JSON.stringify(formData));

        // Add 200ms to the timer, up to a max of 2000ms
        if (timerRef.current) {
          const remainingTime = Math.min(
            2000,
            200 + (timerRef.current as any)._idleTimeout
          );
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(debouncedSave, remainingTime);
        } else {
          debouncedSave();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [methods, debouncedSave]);

  return { form: methods.getValues(), methods, isSaving };
};