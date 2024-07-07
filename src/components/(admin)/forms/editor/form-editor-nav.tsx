"use client";
import { cn } from "@/lib/helpers/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { Input } from "@/components/ui/input";
import { SaveFormButton } from "@/components/(admin)/forms/editor/save-form-button";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { isSavingAtom } from "./atoms";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/administer-dialog";
import { StartObservationDialog } from "@/components/(admin)/forms/dialogs/start-observation-dialog";

export const FormEditorNav = () => {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);
  const formId = getValues(`id`)
  const [isSaving] = useAtom(isSavingAtom);

  return (
    <div className="flex h-12 w-full bg-card/50 border-b border-neutral-300 p-1 flex-row items-center justify-between px-2">
      <div className={cn("flex flex-row items-center space-x-2")}>
        <Input
          size="sm"
          className={cn("text-xl border border-neutral-300 hover:border-neutral-600 font-medium w-64")}
          defaultValue={title}
          {...register("title")}
        />
        <DirectionAwareTabs size="sm" />
        <SaveFormButton isSaving={isSaving} />
      </div>
      <div className={cn("flex flex-row space-x-2")}>
        <AdministerDialog />
        <StartObservationDialog formId={formId} />
      </div>
    </div>
  );
};
