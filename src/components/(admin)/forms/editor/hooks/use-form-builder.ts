import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { autosaveForm } from "@/server/actions/forms/autosave-form";
import { isEqual } from "lodash";
import { useAtom } from "jotai";
import { isSavingAtom } from "../atoms";

export const ZFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string().optional(),
      position: z.number(),
      feedback: z.boolean(),
      milestoneIds: z.array(z.string()),
      options: z.array(
        z.object({
          id: z.string(),
          text: z.string().optional().nullable(),
          pointValue: z.string(),
          position: z.number(),
        }),
      ),
    }),
  ),
});

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

  const handleSave = useCallback(async (formData: TFormSchema) => {
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
  }, []);

  const debouncedSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (latestFormDataRef.current) {
        handleSave(latestFormDataRef.current);
      }
    }, 2000); // Max delay of 2000ms
  }, [handleSave]);

  useEffect(() => {
    const subscription = methods.watch((formData, { name, type }) => {
      console.log(`Change detected: ${name}, type: ${type}`);

      if (!isEqual(formData, previousStateRef.current)) {
        console.log("Change detected, scheduling save");
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
      } else {
        console.log("No change detected in form data");
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
