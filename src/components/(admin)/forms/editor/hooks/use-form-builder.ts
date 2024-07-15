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

export const ZFormSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    formItems: z.array(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        type: z.enum([
          "MULTIPLE_CHOICE",
          "SINGLE_CHOICE",
          "HEADER",
          "RANGE",
          "WRITTEN",
        ]),
        description: z.string().optional().nullable(),
        position: z.number(),
        isRequired: z.boolean().default(true),
        isScored: z.boolean().default(true),
        milestoneIds: z.array(z.string()),
        options: z.array(
          z.object({
            id: z.string(),
            text: z.string().optional().nullable(),
            pointValue: z.string().optional().nullable(),
            isNa: z.boolean().default(false),
            position: z.number(),
          }),
        ),
      }),
    ),
  })
  .refine(
    (data) => {
      // if it is a header, make sure it doesnt have options or milestones or isRequired
      const headerItems = data.formItems.filter((fi) => fi.type === "HEADER");
      if (!headerItems) return;

      const headerItemsWithMilestones = headerItems.filter(
        (hi) => hi.milestoneIds.length > 0,
      );
      const headerItemsWithOptions = headerItems.filter(
        (hi) => hi.options.length > 0,
      );
      const headerItemsThatAreRequired = headerItems.filter(
        (hi) => hi.isRequired,
      );

      if (headerItemsWithMilestones)
        throw new Error("Headers cannot be assigned milestones.");
      if (headerItemsWithOptions)
        throw new Error("Headers cannot have options.");
      if (headerItemsThatAreRequired)
        throw new Error("Headers cannot be required.");
    },
    { path: ["formItems"] },
  )
  .refine(
    (data) => {
      // if it is a written question, make sure it has no options
      const writtenItems = data.formItems.filter((fi) => fi.type === "WRITTEN");
      if (!writtenItems) return;

      const writtenItemsWithOptions = writtenItems.filter(
        (fi) => fi.options.length > 0,
      );
      if (writtenItemsWithOptions)
        throw new Error("Written questions cannot have options.");
    },
    { path: ["formItems"] },
  )
  .refine(
    (data) => {
      // if it is not a header, it can't have a description
      const nonHeaderItems = data.formItems.filter(
        (fi) => fi.type !== "HEADER",
      );
      if (!nonHeaderItems) return;

      const nonHeaderItemsWithDescription = nonHeaderItems.filter(
        (fi) => fi.description !== null,
      );
      if (nonHeaderItemsWithDescription)
        throw new Error("Non-header items cannot have descriptions.");
    },
    { path: ["formItems"] },
  );

export type TFormSchema = z.infer<typeof ZFormSchema>;

export const useFormBuilder = (initialData?: TFormSchema) => {
  const methods = useForm<TFormSchema>({
    resolver: zodResolver(ZFormSchema),
    defaultValues: initialData,
  });
  const [isSaving, setIsSaving] = useAtom(isSavingAtom);
  const previousStateRef = useRef<TFormSchema | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const latestFormDataRef = useRef<TFormSchema | null>(null);

  const handleSave = useCallback(
    async (formData: TFormSchema) => {
      const startTime = Date.now();
      try {
        setIsSaving(true);
        await autosaveForm(formData);
        const endTime = Date.now();
        console.log(`Form saved in ${endTime - startTime}ms`);
      } catch (error) {
        console.error("Error saving form:", error);
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
        latestFormDataRef.current = formData as TFormSchema;
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
