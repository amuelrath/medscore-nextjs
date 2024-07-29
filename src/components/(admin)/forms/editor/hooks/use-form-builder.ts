"use client";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { autosaveForm } from "@/server/actions/forms/autosave-form";
import { isEqual } from "lodash";
import { useAtom } from "jotai";
import { isSavingAtom } from "@/components/(admin)/forms/editor/atoms";
import { toast } from "sonner";
import { v4 } from "uuid";

export const ZFormSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    formItems: z.array(
      z.object({
        id: z.string(),
        text: z.string().nullable(),
        type: z.enum([
          "MULTIPLE_CHOICE",
          "SINGLE_CHOICE",
          "HEADER",
          "RANGE",
          "WRITTEN",
        ]),
        description: z.string().nullable(),
        position: z.number(),
        isRequired: z.boolean(),
        isScored: z.boolean(),
        milestoneIds: z.array(z.string()).default([]),
        options: z
          .array(
            z.object({
              id: z.string(),
              text: z.string().optional().nullable(),
              pointValue: z.union([z.number(), z.string()]).nullable().optional(),
              isNa: z.boolean().default(false),
              position: z.number(),
            }),
          )
          .default([]),
      }),
    ),
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
    defaultValues: !!initialData?.formItems.length
      ? initialData
      : {
          id: initialData?.id,
          title: initialData?.title,
          formItems: [
            {
              id: v4(),
              text: initialData?.title,
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const latestFormDataRef = useRef<TFormSchema | null>(null);

  const handleSave = useCallback(
    async (formData: TFormSchema) => {
      try {
        setIsSaving(true);
        await autosaveForm(formData);
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setIsSaving(false);
      }
    },
    [setIsSaving],
  );

  const debouncedSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (latestFormDataRef.current) {
        handleSave(latestFormDataRef.current).catch(() =>
          toast.error("Error saving form."),
        );
      }
    }, 2000); // Max delay of 2000ms
  }, [handleSave]);

  useEffect(() => {
    const subscription = methods.watch((formData) => {
      if (!isEqual(formData, previousStateRef.current)) {
        latestFormDataRef.current = ZFormSchema.parse(formData);
        previousStateRef.current = JSON.parse(JSON.stringify(formData));

        // Add 200ms to the timer, up to a max of 2000ms
        if (timerRef.current) {
          const remainingTime = Math.min(
            2000,
            200 + (timerRef.current as any)._idleTimeout,
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
