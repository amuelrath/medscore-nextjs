"use client";
import { cn } from "@/lib/helpers/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { Input } from "@/components/ui/input";
import { SaveFormButton } from "@/components/(admin)/forms/editor/save-form-button";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { isSavingAtom } from "./atoms";
import { StartObservationDialog } from "@/components/(admin)/evaluate/home/dialogs/start-observation-dialog";
import { isAfter, isBefore } from "date-fns";
import { ManageDialog } from "@/components/(admin)/forms/dialogs/manage-dialog";
import { useFormResult } from "@/hooks/queries/use-form-result";

export const FormEditorNav = () => {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);
  const formId = getValues(`id`);

  const [isSaving] = useAtom(isSavingAtom);

  const { formResult } = useFormResult(formId);

  const now = new Date();

  const getActiveFormCode = () => {
    return formResult?.formCodes.find(
      (fc) =>
        isAfter(now, fc.startsAt) &&
        isBefore(now, fc.expiresAt) &&
        fc.canceledAt === null,
    );
  };

  return (
    <div className="flex h-12 w-full flex-row items-center justify-between border-b border-neutral-300 bg-card/50 p-1 px-2">
      <div className={cn("flex flex-row items-center space-x-2")}>
        <Input
          size="sm"
          className={cn(
            "w-64 border border-neutral-300 text-xl font-medium hover:border-neutral-600",
          )}
          defaultValue={title}
          {...register("title")}
        />
        <DirectionAwareTabs size="sm" />
        <SaveFormButton isSaving={isSaving} />
      </div>
      <div className={cn("flex flex-row space-x-2")}>

        <ManageDialog />
        <StartObservationDialog formId={formId} />
      </div>
    </div>
  );
};
